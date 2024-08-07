'use server'

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {pool} from '@/app/lib/db/pool';
import {v4} from 'uuid';

const viewerUrl = process.env.NEXT_PUBLIC_VIEWER_URL;

const FormSchemaClientView = z.object({
    id: z.string(),
    project_id: z.string(),
    title: z.string({
        invalid_type_error: 'Please enter a valid title for the view',
    }),
    subtitle: z.string({
        invalid_type_error:'Please enter a valid subtitle for the view',
    }),
    file: z.instanceof(File, { 
        message: 'Please upload the file'
    })
})

const CreateClientViewAutodesk = FormSchemaClientView.omit({id: true, project_id: true, title: true, subtitle: true});

const CreateClientViewDatabase = FormSchemaClientView.omit({id: true, project_id: true, file:true})

export type StateClientView = {
    errors?: {
        title?: string[];
        subtitle?: string[];
        urn?: string[];
    };
    message?: string | null;
}


export async function createClientView ( projectId: string, formData: FormData) {

    const validatedFieldsAutodesk = CreateClientViewAutodesk.safeParse({
        file: formData.get('input')
    });

    if (!validatedFieldsAutodesk.success) {
        console.log("The file is not uploaded");
        return {
          errors: validatedFieldsAutodesk.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to create an autodesk viewer instance.',
        };
    }

    const validatedFieldsDatabase = CreateClientViewDatabase.safeParse({
        title: formData.get('title'),
        subtitle: formData.get('subtitle')
    });

    if (!validatedFieldsDatabase.success) {
        console.log("The Title and Subtitle are not specified");
        return {
          errors: validatedFieldsDatabase.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to create a database record.',
        };
    }

    let data = new FormData();
    data.append('model-file', validatedFieldsAutodesk.data.file);

    
    try {

        // call for APS API
        const resp = await fetch(`${viewerUrl}/api/models`, { method: 'POST', body: data });
        if (!resp.ok) {
            throw new Error(await resp.text());
        }

        const id = v4();
        const timestamp = new Date(); // it kept in the js native format instead of converting to the MySQL native to preserve the info regarding the timezone
        const { name, urn } = await resp.json() // returns the model object with name and urn properties
        const {title, subtitle} = validatedFieldsDatabase.data;

        // call for DB
        // nested try-catch is needed to rollback safely
        try {
            await pool.query(`BEGIN;`)
            await pool.query(`
            INSERT INTO client_views (id, urn, title, subtitle, filename, time_stamp)
            VALUES ("${id}", "${urn}", "${title}", "${subtitle}", "${name}", "${timestamp}");    
            `);
            await pool.query(`
            INSERT INTO project_views (project_id, view_id)
            VALUES ("${projectId}", "${id}");
            `)
            await pool.query(`COMMIT;`);
        } catch (error) {
            await pool.query(`ROLLBACK;`);
            console.log(error);
            return {
                message: 'Database Error: Failed to create machine'
            }
        }

    } catch (error) {
        console.error(error);
    }

    revalidatePath(`/dashboard/projects/${projectId}`); // while passing the id as a props downstream react stranfgely converts it to an object 
    redirect(`/dashboard/projects/${projectId}`);  
}



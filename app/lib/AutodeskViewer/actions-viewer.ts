'use server'

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {pool} from '@/app/lib/db/pool';
import {v4} from 'uuid';
import {createRoom} from '@/app/lib/db/actions-chat'

const url = process.env.URL

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
        const resp = await fetch(`${url}/api/models`, { method: 'POST', body: data });
        if (!resp.ok) {
            throw new Error(await resp.text());
        }

        const id = v4();
        const timestamp = new Date(); // it kept in the js native format instead of converting to the MySQL native to preserve the info regarding the timezone
        const { name, urn } = await resp.json() // returns the model object with name and urn properties
        const {title, subtitle} = validatedFieldsDatabase.data;
        const roomName = [title,subtitle].join('|'); 

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
            await createRoom(id, roomName);
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

const FormSchemaTP = z.object({
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

export async function createTPModel (projectId: string, user: string, formData: FormData) {

    const validatedFields = FormSchemaTP.safeParse({
        file: formData.get('input'),
        title: formData.get('title'),
        subtitle: formData.get('subtitle')
    });

    if (!validatedFields.success) {
        console.log("Some fields necessary to create a TP are missing");
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to create a database record.',
        };
    }

    let data = new FormData();
    data.append('model-file', validatedFields.data.file);

    try {

        // call for APS API
        const resp = await fetch(`${url}/api/models`, { method: 'POST', body: data });
        if (!resp.ok) {
            throw new Error(await resp.text());
        }

        const id = v4();
        const { name, urn } = await resp.json();
        const {title, subtitle} = validatedFields.data;
        const roomName = [title, subtitle].join('|');

        try {

            const query = `
            INSERT INTO tp_models (id, project_id, urn, title, subtitle, filename, created_at, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            `;
            await pool.query(query, [id, projectId, urn, title, subtitle, name, user]);
            await createRoom(id, roomName);
        } catch (error) {
            console.log(error);
            return {
                message: 'Database Error: Failed to create machine'
            }
        }
    } catch (error) {
        console.error(error);
    }
}


'use server'

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {pool, pool_chat, pool_auth} from '@/app/lib/db/pool';
import {v4} from 'uuid';
import {deleteFile, deleteManifest} from '@/app/lib/AutodeskViewer/services/aps';
import { fetchClientViewsByProjectId } from '@/app/lib/db/data';
import { createRoom } from '@/app/lib/db/actions-chat';
import {labelGenerator} from '@/app/lib/labels-handler/labels-handler'
import { s3_getSignedURL_qr, s3_delete_label } from '@/app/lib/aws-s3/actions';

// supplier schemas

const FormSchemaSupplier = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a valid customer name',
    }),
    email: z.string().email({message: 'Please enter a valid email'}),
    phone: z.string({
        invalid_type_error: 'Please enter a valid phone number',
    }),
    address: z.string({message: 'Please enter a valid address'}),
});

const CreateSupplier = FormSchemaSupplier.omit({id: true});

const UpdateSupplier = FormSchemaSupplier.omit({ id:true});

export type StateSupplier = {
    errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        address?: string[];
    };
    message?: string | null;
};

// supplier actions

export async function deleteSupplier(id:string) {
    
    try {
        await pool.query(`
            DELETE FROM supplier_machine WHERE supplier_id = '${id}';
            DELETE FROM suppliers WHERE id='${id}';
            `);
    } catch (error) {
        console.log(error)
    }
    
    revalidatePath('/dashboard/suppliers');
}

export async function createSupplier(prevState: StateSupplier, formData: FormData) {
    
    const validatedFields = CreateSupplier.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone_main'),
        address: formData.get('address')
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Supplier.',
        };
    }


    const id = v4(); 
    const { name, email, phone, address } = validatedFields.data;
    const optionalFields: { [key: string]: any } = {  // HACKED
        url: "url", 
        notes: "notes", 
        contact: "contact", 
        contact_number: "contact number",
        vat: "vat",
        tax_code: "tax code"
    };

    Object.entries(optionalFields).forEach(([key,value]) => {
        formData.get(value)? optionalFields[key] = formData.get(value) : optionalFields[key] = `No ${value} provided`;
    })

    try {
        
        await pool.query(`
            INSERT INTO suppliers (id, name, email, phone, address, url, notes, contact, contact_number, vat, tax_code)
            VALUES ('${id}', "${name}", "${email}", "${phone}", "${address}", "${optionalFields.url}", "${optionalFields.notes}", "${optionalFields.contact}", "${optionalFields.contact_number}", "${optionalFields.vat}", "${optionalFields.tax_code}")
        `);
        
    } catch (error) {
        return {
            message: 'Database Error: Failed to create invoice'
        }
    }

    revalidatePath('/dashboard/suppliers');
    redirect('/dashboard/suppliers');    
}

export async function updateSupplier(id:string, formData: FormData) {

    const validatedFields = UpdateSupplier.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone_main'),
        address: formData.get('address')
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const optionalFields: { [key: string]: any } = {  // HACKED
        url: "url", 
        notes: "notes", 
        contact: "contact", 
        contact_number: "contact number",
        vat: "vat",
        tax_code: "tax code"
    };

    Object.entries(optionalFields).forEach(([key,value]) => {
        formData.get(value)? optionalFields[key] = formData.get(value) : optionalFields[key] = `No ${value} provided`;
    })

    try {
        console.log(id)
        const [result,field] = await pool.query(`
        UPDATE suppliers
        SET name = '${validatedFields.data.name}', email = '${validatedFields.data.email}', phone = '${validatedFields.data.phone}', address = '${validatedFields.data.address}', url = '${optionalFields.url}', notes = '${optionalFields.notes}', contact = '${optionalFields.contact}', contact_number = '${optionalFields.contact_number}', vat = '${optionalFields.vat}', tax_code = '${optionalFields.tax_code}'
        WHERE id = '${id}'
        `) ;
        console.log(result)
    } catch (error) {

        console.log(error);

    }

    revalidatePath('/dashboard/suppliers');
    redirect('/dashboard/suppliers  ');
}

// machine schemas

const FormSchemaMachine = z.object({
    id: z.string(),
    model: z.string({
        invalid_type_error: 'Please enter a valid model name',
    }),
    website: z.string({message: 'Please enter a valid website URL'}),
    supplier: z.string({
        invalid_type_error: 'Please select the supplier',
    }),
    type: z.string({message: 'Please select the machine type'}),
});

const CreateMachine = FormSchemaMachine.omit({id: true});

export type StateMachine = {
    errors?: {
        model?: string[];
        website?: string[];
        supplier?: string[];
        type?: string[];
    };
    message?: string | null;
}

// machine actions

export async function deleteMachine(id:string) {
    
    try {
        await pool.query(`DELETE FROM machinery WHERE id = '${id}'`);
    } catch (error) {
        console.log(error)
    }
    
    revalidatePath('/dashboard/machinery');
}

export async function createMachine(prevState: StateMachine, formData: FormData) {
    
    const validatedFields = CreateMachine.safeParse({
        model: formData.get('model'),
        website: formData.get('website'),
        supplier: formData.get('owner'),
        type: formData.get('type')
    });

    if (!validatedFields.success) {
        console.log("validatedFields is not successfull");
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Add Machine.',
        };
        
    }

    const optionalFields: { [key: string]: any } = {
        x: '-',
        y: '-',
        z: '-',
        r: '-'
    }

    const machineTypesMapping: { [key: string]: any } = {  // HACKED
        '3D Printing': {x:"x-3d",y:"y-3d",z:"z-3d"},
        '5-axis CNC Machine': {x:"x-5-axis" ,y:"y-5-axis",z:"z-5-axis"},
        'CNC Laser Cutter': {x:"x-laser",y:"y-laser"},
        'CNC Lathe': {r:"r-lathe",y:"y-lathe"},
        'CNC Milling Machine (3, 2.5 axis)': {x:"x-3-axis" ,y:"y-3-axis",z:"z-3-axis"},
        'CNC Plasma Cutter': {x:"x-plasma" ,y:"y-plasma",z:"z-plasma"},
        'CNC Press Brake': {y:"y-press"},
        'CNC Waterjet Cutter': {x:"x-waterjet",y:"y-waterjet"}
    };

    const id = v4(); 
    const { model, website, supplier, type } = validatedFields.data;

    const selectedType = machineTypesMapping[type];

    Object.keys(optionalFields).forEach(key => {
        if (selectedType[key] !== undefined) {
            optionalFields[key] = selectedType[key];
        }
    });

    Object.entries(optionalFields).forEach(([key,value]) => {
        formData.get(value)? optionalFields[key] = formData.get(value) : optionalFields[key] = `-`;
    })

    try {
        
        await pool.query(`
            INSERT INTO machinery (id, model, producer_website, supplier_id, type, x, y, z, r)
            SELECT '${id}', "${model}", "${website}", s.id , "${type}", "${optionalFields.x}", "${optionalFields.y}", "${optionalFields.z}", "${optionalFields.r}"
            FROM suppliers s
            WHERE s.name = "${supplier}"
        `);
        
    } catch (error) {
        console.log("db query is not successfull");
        return {
            message: 'Database Error: Failed to create machine'
        }
    }

    revalidatePath('/dashboard/machinery');
    //revalidatePath('/dashboard/suppliers'); Let's see if we need to revalidate this path as well
    redirect('/dashboard/machinery');  
}

// project schemas

const FormSchemaProject = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a valid model name',
    }),
    client: z.string({
        invalid_type_error: 'Please enter a valid client name',
    }),
    address: z.string({
        invalid_type_error: 'Please enter a valid address',
    })
});

const CreateProject = FormSchemaProject.omit({id: true});


export type StateProject = {
    errors?: {
        name?: string[];
        client?: string;
        address?: string;
    };
    message?: string | null;
}

//project actions

export async function createProject(prevState: StateProject, formData: FormData) {

    const validatedFields = CreateProject.safeParse({
        name: formData.get('name'),
        client: formData.get('client'),
        address: formData.get('address')
    });

    if (!validatedFields.success) {
        console.log("validatedFields is not successfull");
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Add Project.',
        };
    }

    const id = v4(); 
    const {name, client, address} = validatedFields.data;
    const suppliers = formData.getAll('supplier');
    const team = formData.getAll('team'); // this is bad because it is name based.

    try {

        await pool.query(`BEGIN;`);
        await pool.query(`
            INSERT INTO projects (id, name, client, address)
            VALUES ("${id}", "${name}", "${client}", "${address}");
        `); 
        await createRoom(id, name);
        for (const member of team) {
            await pool.query(`
                INSERT INTO project_user (project_id, user_id, project_name, user_name)
                SELECT "${id}", u.id, "${name}", "${member}"
                FROM users u
                WHERE u.name = "${member}"; 
            `)
            await pool_chat.query(`
                INSERT INTO rooms_users (room_id, user_id)
                SELECT "${id}", u.email
                FROM Users u
                WHERE u.name = "${member}";
            `)
        }
        for (const supplier of suppliers) {
            await pool.query(`
                INSERT INTO project_supplier (project_id, supplier_id, supplier_status)
                SELECT "${id}", s.id, "Idle"
                FROM suppliers s
                WHERE s.name = "${supplier}";    
            `);
        };
        await pool.query(`COMMIT;`); 
    } catch (error) {
        await pool.query(`ROLLBACK;`);
        console.log(error);
        return {
            message: 'Database Error: Failed to create machine'
        }
    }

    revalidatePath('/dashboard/projects');
    //revalidatePath('/dashboard/suppliers'); Let's see if we need to revalidate this path as well
    redirect('/dashboard/projects');  
}

export async function deleteProject(id:string) {

    const views = await fetchClientViewsByProjectId(id);
    console.log('fetched views', views);

    views?.forEach((view) => {
        deleteClientView(view.id, view.filename, view.urn)
    });

    try {
        await pool.query(`
            DELETE FROM projects WHERE id='${id}';
        `);
        await pool_chat.query(`
            DELETE FROM Rooms WHERE id='${id}';    
        `);
    } catch (error) {
        console.log(error)
    }
    
    revalidatePath('/dashboard/projects');
}

//client view action

export async function deleteClientView(id:string, filename:string, urn:string) {

    //TODO: views remove logic
    console.log('client view deletion id ', id);
    console.log('client view deletion filename (bucketKey)', filename)
    console.log('urn is ', urn)

    try {

        // to make the file unavailable to be viewed you need to delete the file itself
        const delFile_resp = await deleteFile(filename);
        console.log('here is the delFile_resp ', delFile_resp);
        // and the derivatives (which are the things that are actually being viewed)
        const delManifest_resp = await deleteManifest(urn);
        console.log('here is the delManifest_resp', delManifest_resp)
        // as well as to delete the client view from internal db
        await pool.query(`
            DELETE FROM client_views WHERE id = '${id}';
        `)
        // MySQL does not support the foreign constraint reference between different db. So we have
        // ensure data integrity on the application level (delete the coresponding room from the 
        // maestro_chat db as well as the rooms_user record from the maestro_email_auth db)
        await pool_chat.query(`
            DELETE FROM Rooms WHERE id = '${id}';
        `)
        await pool_auth.query(`
            DELETE FROM rooms_users WHERE room_id = '${id}';  
        `)
    } catch (error) {
        console.log('error from deleteClientView', error)
    }
    
    revalidatePath(`/dashboard/projects/${id}`);
}

// superset action

const FormSchemaSuperset = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a valid superset title',
    }),
    data: z.string({
        invalid_type_error: 'getState() could not fetch the view',
    }),
    client_view_id: z.string({
        invalid_type_error: 'Client View Id is missing',
    })
});

export type StateSuperset = {
    errors?: {
        name?: string;
        data?: string;
        client_view_id?: string;
        id?: string;
    };
    message?: string | null;
}

export async function createSupersetView(prevState: StateProject, formData: FormData) {

    const validatedFields = FormSchemaSuperset.safeParse({
        name: formData.get('new-superset-name'),
        data: formData.get('new-superset-view'),
        client_view_id: formData.get('new-superset-client-id'),
        id: formData.get('new-superset-id'),
    });

    if (!validatedFields.success) {
        console.log("validatedFields is not successfull");
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Add Machine.',
        };
    }

    const {name, data, client_view_id, id} = validatedFields.data;

    await pool.query(`
        INSERT INTO superset_view (id, ss_title, data, client_view_id)
        VALUES ('${id}', '${name}','${data}', '${client_view_id}')
    `)

    const labelArray = await labelGenerator({zoneId: id, zoneName: name, viewId: client_view_id});
    const label_signedUrl = await s3_getSignedURL_qr(client_view_id, id);

    if (label_signedUrl.failure !== undefined) {
        console.error("Couldn't obtain a signd url for the maestro bucket");
        return
    }

    const url = label_signedUrl.success?.url;

    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: labelArray
    });
}

export type StateGeometryData = {
    errors?: {
        geometry_data?: string;
        client_view_id?: string;
    };
    message?: string | null;
}

const FormSchemaGeometryData = z.object({
    geometry_data: z.string({
        invalid_type_error: 'geometry_data is missing',
    }),
    client_view_id: z.string({
        invalid_type_error: 'client_view_id is missing',
    }),
});


export async function createGeometryData(prevState: StateGeometryData, formData: FormData) {
    console.log('Create geometry data event has been triggered!');

    const validatedFields = FormSchemaGeometryData.safeParse({
        geometry_data: formData.get('geometry-data'),
        client_view_id: formData.get('client-view-id'),
    });

    if (!validatedFields.success) {
        console.log("validatedFields is not successfull", validatedFields.error.flatten().fieldErrors);
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Add Machine.',
        };
    }

    const {geometry_data, client_view_id} = validatedFields.data;

    console.log('The geometry data to be submitted is ', geometry_data)

    const query = `
        INSERT INTO geometry_status (geometry_state, client_view_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        geometry_state = VALUES(geometry_state)
    `;

    try {
        await pool.query(query, [geometry_data, client_view_id])
    } catch (err) {
        console.error('createGeometryData was not successful, ', err)
    }
}

export async function deleteSuperset(clientViewId: string, supersetId: string) {

    try {

        const query = `
            DELETE FROM superset_view WHERE id = ?
        `
        
        await pool.query(query, [supersetId]);

        const res = await s3_delete_label(clientViewId, supersetId);

        console.log("S3 delete res", res);

    } catch (err) {
        console.error('error from deleteSuperset', err)
    }

}
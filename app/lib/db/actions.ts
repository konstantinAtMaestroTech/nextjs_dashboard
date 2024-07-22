'use server'

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {pool} from '@/app/lib/db/pool';
import {v4} from 'uuid';

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
});

const CreateProject = FormSchemaProject.omit({id: true});

export type StateProject = {
    errors?: {
        name?: string[];
    };
    message?: string | null;
}

//project actions

export async function createProject(prevState: StateProject, formData: FormData) {

    const validatedFields = CreateProject.safeParse({
        name: formData.get('name')
    });

    console.log(formData);
    console.log(formData.getAll('supplier'));

    if (!validatedFields.success) {
        console.log("validatedFields is not successfull");
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Add Machine.',
        };
    }

    const id = v4(); 
    const {name} = validatedFields.data;
    const suppliers = formData.getAll('supplier');

    try {

        await pool.query(`BEGIN;`);
        await pool.query(`
            INSERT INTO projects (id, name)
            VALUES ("${id}", "${name}");
        `);
        for (const supplier of suppliers) {
            await pool.query(`
                INSERT INTO project_supplier (project_id, supplier_id, supplier_name, project_name)
                SELECT "${id}", s.id, "${supplier}", "${name}"
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

    revalidatePath('/dashboard/machinery');
    //revalidatePath('/dashboard/suppliers'); Let's see if we need to revalidate this path as well
    redirect('/dashboard/machinery');  
}

export async function deleteProject(id:string) {
    
    try {
        await pool.query(`
            DELETE FROM project_client_page WHERE project_id = '${id}';
            DELETE FROM projects WHERE id='${id}';
            `);
    } catch (error) {
        console.log(error)
    }
    
    revalidatePath('/dashboard/projects');
}
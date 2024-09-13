'use server';

import {z} from 'zod';
import {signIn} from '@/auth';
import {AuthError} from 'next-auth';
import {pool_auth} from '@/app/lib/db/pool'


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something wentwrong.';
            }
        }
        throw error;
    }
}

const FormSchemaUser = z.object({
    name: z.string({
        invalid_type_error: 'Please enter a valid user name',
    }),
    email: z.string().email({message: 'Please enter a valid email'}),
    role: z.string({
        invalid_type_error: 'Please enter a valid role',
    }),
    viewid: z.string({
        invalid_type_error: 'RoomId is missing',
    })
});

type StateUser = {
    errors?: {
        name?: string[];
        email?: string[];
        role?: string[];
        viewid?: string[];
    };
    message?: string | null;
};

const initialState: StateUser = {message:null, errors: {}};

async function createTempUser(prevState: StateUser, formData: FormData) {
    
    const validatedFields = FormSchemaUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        viewid: formData.get('viewid')
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Supplier.',
        };
    }


    const { name, email, role, viewid } = validatedFields.data;

    try {
        
        await pool_auth.query('BEGIN');

        await pool_auth.query(`
            INSERT IGNORE INTO NonVerifiedUser (name, email, role)
            VALUES (?, ?, ?)
        `, [name, email, role]);

        // of course this should be assigned later when the user actually clicks the link. However i think it might 
        // add additional coplexity and i prefer to opt to this less reasonable but faster way to proceed
        
        await pool_auth.query(`
            INSERT IGNORE INTO rooms_users (room_id, user_id)
            VALUES (?, ?)
        `, [viewid, email]);

        await pool_auth.query('COMMIT');
        
    } catch (error) {

        await pool_auth.query('ROLLBACK');
        throw error;
    }

}

export async function authenticateClient(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        // please zod it at some point
        const email = formData.get('email');
        const id = formData.get('viewid');

        await createTempUser(initialState, formData)
        await signIn('email', { email: email, redirectTo: `/client/${id}`});
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something wentwrong.';
            }
        }
        throw error;
    }
}
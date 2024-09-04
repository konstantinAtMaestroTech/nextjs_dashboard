'use server';

import {z} from 'zod';
import {pool_chat} from '@/app/lib/db/pool';
import {v4} from 'uuid';
import {auth} from '@/auth';

function createMysqlTimestamp() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const FormSchemaMessage = z.object({
    id: z.string(),
    message: z.string({
        invalid_type_error: 'Please enter a message',
    })
});

const CreateMessage = FormSchemaMessage.omit({
    id:true
});

export type StateMessage = {
    errors?: {
        message?: string[];
    };
    message?: string | null;
};

export async function createMessage(prevState: StateMessage | undefined, formData: FormData): Promise<StateMessage | undefined> {

    const Pusher = require("pusher");

    const session = await auth()
    console.log('session from the createMessage', session);
    
    const validatedFields = CreateMessage.safeParse({
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Message.',
        };
    }


    const id = v4(); 
    const {message} = validatedFields.data;
    const timestamp = createMysqlTimestamp();
    const email = session?.user?.email;
    const name = session?.user?.name;
    const roomid = formData.get('room_id');

    console.log('Message server-side, ', message);

    try {
        
        const query = `
            INSERT INTO Messages (id, message, time_stamp, user_id, room_id)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [id, message, timestamp, email, roomid]

        const [result] = await pool_chat.query(query, values);

        const pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.NEXT_PUBLIC_PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: "eu",
            useTLS: true,
        });
        
        await pusher.trigger(roomid, "message", {
            message: message,
            time_stamp: timestamp,
            name: name,
            email: email
        });

        console.log('results are here, ', result )
        
    } catch (error) {
        return {
            message: 'Database Error: Failed to create message'
        }
    }

}

export async function createUserRecord(email: string, roomid: string, name: string) {
    try {

        const Pusher = require("pusher");

        const id = v4();
        const timestamp = createMysqlTimestamp();
        
        const [result, fields] = await pool_chat.query(`
            INSERT IGNORE INTO rooms_users (room_id, user_id)
            VALUES ('${roomid}', "${email}")
        `);
        
        if (result.affectedRows !== 0) {

            await pool_chat.query(`
                INSERT INTO Messages (id, message, time_stamp, user_id, room_id)
                VALUES ('${id}', "User ${name} has joined the chat", "${timestamp}", "admin@maestro-tech.com", "${roomid}")
            `);

            const pusher = new Pusher({
                appId: process.env.PUSHER_APP_ID,
                key: process.env.NEXT_PUBLIC_PUSHER_KEY,
                secret: process.env.PUSHER_SECRET,
                cluster: "eu",
                useTLS: true,
            });
            
            await pusher.trigger(roomid, "new-user", {
                message: `User ${name} has joined the chat`,
                time_stamp: timestamp,
                name: name,
                email: email
            });
        }
        
    } catch (error) {
        throw new Error('Failed to cerate a user.');
    }
}

'use server';

import {z} from 'zod';
import {pool_chat} from '@/app/lib/db/pool';
import {v4} from 'uuid';
import {auth} from '@/auth';
import {JSDOM} from 'jsdom'
import { fetchProjectById, fetchUrnByClientViewId } from '@/app/lib/db/data';

interface UserCredentials {
    email: string;
    name: string;
}

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

export async function createUser(email: string, name: string) {
    try {
        
        const [result, fields] = await pool_chat.query(`
            INSERT IGNORE INTO Users (email, name)
            VALUES ('${email}', "${name}")
        `);
        
    } catch (error) {
        throw new Error('Failed to cerate a user.'); // :)
    }
}

export async function createRoom(id:string, name:string) {
    try {

        const message_id = v4();
        const timestamp = createMysqlTimestamp();

        await pool_chat.query(`
            INSERT INTO Rooms (id, name)
            VALUES (?, ?)
        `, [id, name]);
        await pool_chat.query(`
            INSERT INTO Messages (id, message, time_stamp, user_id, room_id)
            VALUES ('${message_id}', "The chat room ${name} has been successfully created", "${timestamp}", "admin@maestro-tech.com", "${id}")
        `);

    } catch (error) {

        console.log('Failed to create the chat room', error);

    }
}


export async function createMessage(prevState: StateMessage | undefined, formData: FormData): Promise<StateMessage | undefined> {

    function getCredentialsFromSpan(htmlString: string): UserCredentials[] {
        
        // Parse the HTML string into a DOM object
        const dom = new JSDOM(htmlString);
        const doc = dom.window.document;
        
    
        // Find all span elements
        const spans = doc.querySelectorAll('span');
        const credentials: UserCredentials[] = [];
    
        // Check if any span has an id starting with "user_"
        for (const span of spans) {
            if (span.id.startsWith('user_')) {
                // Extract and return the second part of the id
                const parts = span.id.split('_');
                if (parts.length > 1) {
                    const user = {
                        email: parts[1],
                        name: parts[2],
                    }
                    credentials.push(user);
                }
            }
        }
    
        return credentials;
    }
    
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
    const sender = formData.get('sender');

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

            id: id,
            message: message,
            time_stamp: timestamp,
            name: name,
            email: email

        });

        // here we add email delivery on a mention

        const cred = getCredentialsFromSpan(message);

        if (cred.length) {

            const projectURL = process.env.URL;

            switch (sender) {
                case "cview":
                    const {title, subtitle} = await fetchUrnByClientViewId(roomid) // this is for the client view case only

                    for (const element of cred) {

                        const payload = {
                            senderName: name,
                            receiverEmail: element.email,
                            receiverName: element.name,
                            projectTitle: title,
                            projectSubtitle: subtitle,
                            projectURL: `${projectURL}/client/${roomid}#${id}`,
                        }
            
                        try {
                            const res = await fetch(`${projectURL}/api/send`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Maestro-Sender': 'cview'
                                },
                                body: JSON.stringify(payload),
                            });
                
                            if (!res.ok) {
                                throw new Error(`HTTP error! status: ${res.status}`);
                            }
                
                            const responseData = await res.json();
                            console.log('response data is,', responseData);
                        } catch (error) {
                            console.error('Fetch error:', error);
                        }
                    }
                    break;
                case "project":

                    const project = await fetchProjectById(roomid)

                    for (const element of cred) {
                        const payload = {
                            senderName: name,
                            receiverEmail: element.email,
                            receiverName: element.name,
                            project: project[0].name,
                            projectURL: `${projectURL}/dashboard/projects/${roomid}#${id}`
                        }

                        try {
                            const res = await fetch(`${projectURL}/api/send`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Maestro-Sender': 'project'
                                },
                                body: JSON.stringify(payload),
                            });
                
                            if (!res.ok) {
                                throw new Error(`HTTP error! status: ${res.status}`);
                            }
                
                            const responseData = await res.json();
                            console.log('response data is,', responseData);
                        } catch (error) {
                            console.error('Fetch error:', error);
                        }
                    }    
                    break;
                default:
            }
        }
        

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
        throw new Error(error);
    }
}



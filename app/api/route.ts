import {pool} from '@/app/lib/db/pool';
import {users} from '@/users';
import {v4} from 'uuid';
import bcrypt from 'bcrypt';

async function addUsers (users: any[]) {
    for (const user of users) {

        const id = v4();
        const hashedPassword = await bcrypt.hash(user.password, 10);

        try {
            await pool.query(`
                INSERT INTO users (id, name, email, pwd)
                VALUES ("${id}", "${user.name}", "${user.email}", "${hashedPassword}")  
            `)
        } catch (error) {
            console.log(error)
        }
    }
}

/* export async function GET() {
    try {
        console.log('users are added');
        await addUsers(users);
        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {

      return Response.json({ error }, { status: 500 });
    }
} */
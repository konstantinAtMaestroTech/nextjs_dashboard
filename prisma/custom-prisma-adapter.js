import { pool_auth } from "@/app/lib/db/pool";
import {PrismaAdapter} from "@auth/prisma-adapter";
import { createUser } from "@/app/lib/db/actions-chat";

async function fetchUserByEmail(email) {
  try {
    const [result, fields] = await pool_auth.query(`
      SELECT 
        name,
        role
      FROM NonVerifiedUser
      WHERE email = '${email}';
    `)
    return result[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to client view.');
  }
}

async function deleteNonVerifiedUser(email) {
  try {
    const [result, fields] = await pool_auth.query(`
      DELETE FROM NonVerifiedUser
      WHERE email = '${email}';
    `)
    return
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to client view.');
  }
}

// this thing is here because extending an adapter is the only way 
// to add custom attributes to the db schema. Then this custom attributes
// (using jwt() and session() callbacks from authConfig) are passed
// to the client to implement the role based access (AND HIGH DEGREE OF PERSONALZATION) 

/** @return { import("next-auth/adapters").Adapter } */
export default function CustomPrismaAdapterForNextAuth(prisma) {
  const adapter = PrismaAdapter(prisma);

  adapter.createUser = async data => {

    console.log('data from CustomPrismaAdapterForm', data);
    
    const userExist = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (userExist) {
      return userExist;
    }

    // very hacky way now. I create a temp fieled in the NonVerifiedUser table on form submission
    // now having the email passed to adapter.createUser i will use it to query the data and insert
    // to the actual User table

    const user = await fetchUserByEmail(data.email);


    /* Since we have two auth we ended up with two User tables. At this point i will just duplicate users 
    who log with a link to the users table in maestro_chat database. It needs to be re-organized*/

    await createUser(data.email, user.name);

    console.log('User form CustomPrismaAdapter', user);

    const created = prisma.user.create({
      data: {
        email: data.email,
        name: user.name,
        role: user.role, 
        emailVerified: data.emailVerified
      }
    });

    await deleteNonVerifiedUser(data.email);

    return created
  };

  return adapter;
}
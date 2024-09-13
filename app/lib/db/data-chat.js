import {pool_chat} from '@/app/lib/db/pool'


export async function fetchRoomChat(room_id) {
    // i dont like this query because it does not utilise the junction table
    try {
        const [result, fields] = await pool_chat.query(`
            SELECT
                Messages.id,
                Messages.message,
                Messages.time_stamp,
                Users.name,
                Users.email
            FROM
                Messages
            INNER JOIN
                Users
            ON
                Messages.user_id = Users.email
            WHERE
                Messages.room_id = "${room_id}"
            ORDER BY
                Messages.time_stamp ASC;
        `)
        return result;
    } catch (error) {
        console.error('Database Error:', error);
    }
}

export async function fetchRoomUsers(room_id) {
    try {
        const [result, fields] = await pool_chat.query(`
            SELECT
                Users.name,
                Users.email
            FROM
                Users
            INNER JOIN
                rooms_users
            ON
               Users.email = rooms_users.user_id
            WHERE
                rooms_users.room_id = "${room_id}"
        `)
        return result;
    } catch(error) {
        console.error('Database Error:', error);
    }
}

export async function fetchRoomUserId(room_id) {
    try {
        const [result, fields] = await pool_chat.query(`
            SELECT
                user_id
            FROM
                rooms_users
            WHERE
                rooms_users.room_id = "${room_id}"
        `)
        return result;
    } catch(error) {
        console.error('Database Error:', error);
    }
}
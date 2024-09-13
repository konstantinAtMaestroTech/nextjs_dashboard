import {pool_auth} from '@/app/lib/db/pool'

export async function fetchRoomUserId(room_id) {
    try {
        const [result, fields] = await pool_auth.query(`
            SELECT
                user_id
            FROM
                rooms_users
            WHERE
                room_id = "${room_id}"
        `)
        return result;
    } catch(error) {
        console.error('Database Error:', error);
    }
}
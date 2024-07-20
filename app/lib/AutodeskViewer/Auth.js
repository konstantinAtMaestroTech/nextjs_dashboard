import credentials from '@/app/lib/AutodeskViewer/credentials';
import axios from 'axios';

async function getAccessToken() {
    try {
        const response = await axios.post(credentials.Authentication, credentials.body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': `Basic ${credentials.clientAuthKeys}`
            }
        });

        if (response.status !== 200) {
            console.log(response);
            throw new Error('Network response was not ok');
        }

        const data = response.data;
        return data;

    } catch (error) {
        if (error instanceof Error) {

            console.log(error);
            return Response.json(error.message)

        } else {

            return Response.json(error)
            
        }
    }
}

const Client = { getAccessToken };
export default Client;
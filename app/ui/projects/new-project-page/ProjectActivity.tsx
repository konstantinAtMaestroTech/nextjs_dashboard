import Chat from '@/app/ui/projects/new-project-page/Chat/Chat'
import { fetchClientViewsByProjectId, fetchUsersByProjectId, fetchSuppliersByProjectId } from '@/app/lib/db/data';
import {fetchRoomChat} from '@/app/lib/db/data-chat'

// DISCLAIMER: here i repeat some fetch calls that i have already performed in other components.
// the first thought was to move the data fetching to the componnets tree top and then pass the 
// data as props. However this way i will sacrifice streaming. I do not know whic strategy is preferable.
// i expect next to manage some data caching however i am not quite sure.

export default async function ProjectActivity(props:any ) {

    const {id, session} = props;

    // models
    const views = await fetchClientViewsByProjectId(id);

    // project data
    const team = await fetchUsersByProjectId(id);
    const suppliers = await fetchSuppliersByProjectId(id);

    // messages
    const chat = await fetchRoomChat(id);
    
    return (

        <>
            <div className="flex items-center justify-center text-sm p-2">
                PROJECT ACTIVITY
            </div>
            <Chat id={id} session={session} views={views} team={team} suppliers={suppliers} chat={chat}/>
        </>
    )
}
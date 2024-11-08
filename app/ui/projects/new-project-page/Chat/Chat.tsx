'use client'

import Messages from '@/app/ui/projects/new-project-page/Chat/Messages';
import MessageForm from '@/app/ui/projects/new-project-page/Chat/MessageForm';

export default function Chat(props:any) {

    const {id, session, views, team, suppliers, chat} = props

    return (
        <>
        <Messages chat={chat} id={id} activeUser={session.user.email} views={views}/> 
        {/*i am not sure whether i need to pass views, suppliers, users and other 
        items as props to the Messages component. all information can be later retrieved from the 
        lexical nodes but let's see*/}
        <MessageForm 
            team={team} /* this is to send messages for the team members */
            views={views} /* this is to mention views of the given project and redirect */
            suppliers={suppliers} /* this is to redirct to the suppliers page */
            id = {id} 
            session = {session}
        />
        </>
    )

}
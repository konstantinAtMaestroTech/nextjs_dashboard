'use client'

import {useState} from 'react';
import ChatMessages from '@/app/ui/chat/chat-messages';
import RoomUsers from '@/app/ui/chat/room-users';
import MessageFormLexical from '@/app/ui/chat/message-form-lexical';
import clsx from 'clsx';

/* const MessageForm = dynamic(() => import('@/app/ui/chat/message-form'), {
  ssr: false,
}); // dynamic for domPurify purposes */

//Add
// export const dynamic = "force-dynamic"; let's try without this thing

export default function Chat(data) {

    const viewerTools = [{ name :'Selection'}]; // it is defined here because of the filteredCommandsLength definition that is here as well

    const [showCommand, setShowCommand] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCommand, setSelectedCommand] = useState(0)
    const [filteredCommandsLength, setFilteredCommandLength] = useState(data.users.length + data.views.length + viewerTools.length)

    console.log("lets see the views, ", data.views);

    const handleShowCommand = () => setShowCommand(true);
    const handleHideCommand = () => {
        setShowCommand(false);
        setFilteredCommandLength(data.users.length + data.views.length + viewerTools.length);
    };
    const handleSearchQueryChange = (query) => setSearchQuery(query)

    return (
        <div id='chat' className={clsx('absolute bg-white', {
            'hidden': data.activeMenu !== "chat"
        })} style={{ 
            height: 'calc(70vh - 104.5px)', // i leave it this way as a reminder about the workaround i had to do to calculate the height of the element when it was full-width
            maxWidth: '25%',
            top: 10,
            left: 56,
            right: 0,
            bottom: 0,
            zIndex: 1001,
            overflow: 'auto'
        }}
        >
            <div className='flex flex-col h-full'>
                <RoomUsers users={data.users} />
                <ChatMessages chat={data.chat} roomid={data.room} activeUser={data.session.user.email} viewer={data.viewer} views={data.views}/>
                <MessageFormLexical
                    users={data.users}
                    views={data.views}
                    viewerTools={viewerTools}
                    searchQuery={searchQuery}
                    setFilteredCommandLength={setFilteredCommandLength} 
                    roomid={data.room} 
                    email={data.session.user.email}
                    name={data.session.user.name} 
                    selectedCommand={selectedCommand}
                    onHideCommand={handleHideCommand}
                    showCommand={showCommand} 
                    onShowCommand={handleShowCommand}
                    onSearchQueryChange={handleSearchQueryChange}
                    setSelectedCommand={setSelectedCommand}
                    filteredCommandsLength={filteredCommandsLength}
                    viewer={data.viewer}
                />
            </div>
        </div>
    );
}


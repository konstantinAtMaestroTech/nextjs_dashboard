'use client'

import {useState} from 'react';
import ChatMessages from '@/app/ui/chat/chat-messages';
import RoomUsers from '@/app/ui/chat/room-users';
import MessageFormLexical from '@/app/ui/chat/message-form-lexical';

/* const MessageForm = dynamic(() => import('@/app/ui/chat/message-form'), {
  ssr: false,
}); // dynamic for domPurify purposes */

//Add
// export const dynamic = "force-dynamic"; let's try without this thing

export default function Chat(data) {

    const [showCommand, setShowCommand] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCommand, setSelectedCommand] = useState(0)
    const [filteredCommandsLength, setFilteredCommandLength] = useState(data.users.length + data.views.length)

    console.log("lets see the views, ", data.views);

    const handleShowCommand = () => setShowCommand(true);
    const handleHideCommand = () => {
        setShowCommand(false);
        setFilteredCommandLength(data.users.length + data.views.length);
    };
    const handleSearchQueryChange = (query) => setSearchQuery(query)

    return (
        <div id='chat' className='absolute' style={{ 
            height: 'calc(100vh - 104.5px)', 
            top: '104.5px',
            width: '25%',
            left: 0
        }}
        >
            <div className='flex flex-col h-full'>
                <RoomUsers users={data.users} />
                <ChatMessages chat={data.chat} roomid={data.room} activeUser={data.session.user.email} viewer={data.viewer} views={data.views}/>
                {/* {showCommand && (
                    <div className="">
                        <ChatCommands 
                            users={data.users} 
                            views={data.views}
                            searchQuery={searchQuery}
                            selectedCommand={selectedCommand}
                            setFilteredCommandLength={setFilteredCommandLength}    
                        />
                    </div>
                )} */}
                <MessageFormLexical
                    users={data.users}
                    views={data.views}
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
                />
                {/* <MessageForm 
                    roomid={data.room} 
                    email={data.session.user.email}
                    name={data.session.user.name} 
                    onHideCommand={handleHideCommand}
                    showCommand={showCommand} 
                    onShowCommand={handleShowCommand}
                    onSearchQueryChange={handleSearchQueryChange}
                    setSelectedCommand={setSelectedCommand}
                    filteredCommandsLength={filteredCommandsLength}
                /> */}
            </div>
        </div>
    );
}


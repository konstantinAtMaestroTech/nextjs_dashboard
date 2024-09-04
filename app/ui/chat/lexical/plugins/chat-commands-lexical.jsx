'use client'

import {useState, useEffect} from 'react';
import clsx from 'clsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { CONTENT_LINK_COMMAND_USER, CONTENT_LINK_COMMAND_VIEW } from '@/app/ui/chat/message-form-lexical';

export default function ChatCommandsPlugin(props) {

    const {users, views, searchQuery, selectedCommand, setFilteredCommandLength} = props; // a first test without the selected geometry and current view as available tags
    const [editor] = useLexicalComposerContext();

    const [filteredCommands, setFilteredCommands] = useState({
        filteredUsers: users,
        filteredViews: views
    })

    console.log('RERENDER IS FIRED! the filteredCommands object is cosi', filteredCommands);

    useEffect(() => {
        if (!searchQuery) return;
        let f_Views = views.filter(view => view.ss_title.toLowerCase().includes(searchQuery.toLowerCase()));
        let f_Users = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredCommands({
            filteredViews: f_Views,
            filteredUsers: f_Users
        });
        setFilteredCommandLength(f_Views.length + f_Users.length);
        console.log('filteredCommands from useEffect hook',filteredCommands)
        return;
    }, [searchQuery]);

    function handleViewClick(view, index, editor) {
        editor.dispatchCommand(CONTENT_LINK_COMMAND_VIEW, view);
    }

    function handleUserClick(user, index, editor) {
        editor.dispatchCommand(CONTENT_LINK_COMMAND_USER, user);
    }

    return (
        <div className="mx-3 flex flex-col border border-gray-200 max-h-52 overflow-y-auto rounded-lg scrollbar">
            <div id="views" className="flex flex-col rounded-lg">
                <div className="font-light p-2 flex justify-left items-center bg-gray-400 text-sm text-white rounded-t-lg">{"Views"}</div>
                {filteredCommands.filteredViews.map((view, index) => (
                    <button
                        id={`command-${index}`}
                        key={index}
                        className={clsx("font-light text-left p-2 focus:border-transparent focus:outline-none hover:bg-gray-100 focus:bg-gray-100", {
                            'bg-gray-100': index == selectedCommand
                        })}
                        tabIndex={0}
                        onClick={() => {handleViewClick(view, index, editor)}}
                    >
                        {view.ss_title}
                    </button>
                ))}
            </div>
            <div id="users" className="flex flex-col rounded-lg">
                <div className="font-light p-2 flex justify-left items-center bg-gray-400 text-sm text-white">{"Users"}</div>
                {filteredCommands.filteredUsers.map((user, index) => (
                    <button
                        id={`command-${filteredCommands.filteredViews.length + index}`}
                        key={filteredCommands.filteredViews.length + index}
                        className={clsx("font-light text-left p-2 focus:border-transparent focus:outline-none hover:bg-gray-100 focus:bg-gray-100",{
                            'bg-gray-100': filteredCommands.filteredViews.length + index == selectedCommand
                        })}
                        tabIndex={0}
                        onClick={() => {handleUserClick(user, filteredCommands.filteredViews.length + index, editor)}}
                    >
                        {user.name}                         
                    </button>
                ))}
            </div>
        </div>
    )

}


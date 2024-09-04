'use client'

import {useMemo, useRef, useEffect} from 'react';
import clsx from 'clsx'

export default function ChatCommands(props) {

    const {users, views, searchQuery, selectedCommand, setFilteredCommandLength} = props; // a first test without the selected geometry and current view as available tags

    const filteredCommands = useMemo(() => {
        let filteredUsers = users;
        let filteredViews = views;
        if (!searchQuery) return {filteredViews, filteredUsers};
        filteredViews = views.filter(view => view.ss_title.toLowerCase().includes(searchQuery.toLowerCase()));
        filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredCommandLength(filteredViews.length + filteredUsers.length)
        return {filteredViews, filteredUsers};
    }, [views, users, searchQuery]);

    function handleViewClick(view) {
        console.log(view)
    }

    function handleUserClick(user) {
        console.log(user)
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
                        onClick={() => {handleViewClick(view)}}
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
                        onClick={() => {handleUserClick(user)}}
                    >
                        {user.name}                         
                    </button>
                ))}
            </div>
        </div>
    )

}
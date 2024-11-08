'use client'

import {useEffect, useRef, useState} from 'react';
import Pusher from 'pusher-js';
import clsx from 'clsx';

// i need to refactor two chats. I solemnly swear to do it next week

export default function Messages (props) {

    const {chat, id, activeUser, views} = props

    const [totalComments, setTotalComments] = useState(chat);
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: "eu",
        });
        let channel = pusher.subscribe(id);
        channel.bind("message", function (data) {
            setTotalComments((prev) => [...prev, data]);
        });
        channel.bind("new-user", function (data) {
            data.name= "admin";
            data.email= "admin@maestro-tech.com";
            setTotalComments((prev) => [...prev, data]);
        })

        return () => {
            pusher.unsubscribe(id);
        };
    }, []);

    // messages windows clicks handler


    useEffect(()=>{

        // her let's just make it easy and fast without mapping

        const handleClick = (event) => {
            const target = event.target;
            if (target && target.id.includes('supplier_')) {
                const chunks = target.id.split('_');
                const supplier_id = chunks[chunks.length-1];
                const url = `${process.env.NEXT_PUBLIC_URL}/dashboard/suppliers/${supplier_id}/info`

                window.open(url ,'_blank');
            } else if (target && target.id.includes('cview_')) {
                const chunks = target.id.split('_');
                const cview_id = chunks[chunks.length - 1];
                const url = `${process.env.NEXT_PUBLIC_URL}/client/${cview_id}`;

                window.open(url, '_blank');
            }
        }

        const chatContainer = chatContainerRef.current

        if (chatContainer) {
            chatContainer.addEventListener('click', handleClick)
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('click', handleClick)
            }
        };

    }, [])

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({block: "nearest", behavior: "smooth" });
    };

    // logic for the project specific chat

    //

    useEffect(() => {
        const messageId = window.location.hash.substring(1);
        if (messageId) {
            const messageElement = document.getElementById(messageId);
            if (messageElement) {
                messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
                messageElement.classList.add('highlighted-message');
                setTimeout(() => {
                    messageElement.classList.remove('highlighted-message');
                }, 5000); // Remove highlight after 2 seconds
                history.replaceState(null, '', ' ');
            }
        } else {
            scrollToBottom();
        }
    }, [totalComments])

    return (
        <div ref={chatContainerRef} className="flex flex-1 m-2 p-2 bg-white overflow-y-auto">
            <div className="flex flex-1 flex-col gap-4">
                {totalComments.map((message, index) => (
                    <div key={index} id={message.id}>
                        <div className={clsx(
                            "flex items-center",
                            {
                                "justify-start": message.email == activeUser,
                                "justify-end": message.email != activeUser && message.email != "admin@maestro-tech.com",
                                "justify-center": message.email == "admin@maestro-tech.com"
                            }
                        )}>
                            <div className={clsx(
                                "rounded-lg p-4 shadow-md self-start",
                                {
                                    "bg-white": message.email == activeUser,
                                    "bg-gray-100": message.email != activeUser && message.email != "admin@maestro-tech.com",
                                    "bg-gray-200": message.email == "admin@maestro-tech.com"
                                }
                            )} style={{ 
                                wordWrap: 'break-word', // Ensures long words break and wrap
                                whiteSpace: 'pre-wrap', // Preserves white space and wraps text when necessary
                                overflowWrap: 'break-word', // Breaks long words to avoid overflow
                                maxWidth: '100%', // Ensures the message does not exceed the container's width
                                boxSizing: 'border-box' // Includes padding and border in the element's total width and height
                            }}
                                dangerouslySetInnerHTML={{ __html: message.message }} // seems like lexical sanitzes input so must be safe
                            >
                            </div>
                        </div>
                        <p className={clsx(
                            "font-light text-sm text-gray-600",
                            {
                                "text-left": message.email == activeUser,
                                "text-right": message.email != activeUser && message.email != "admin@maestro-tech.com",
                                "text-center": message.email == "admin@maestro-tech.com"
                            }
                        )}>
                            {message.email == "admin@maestro-tech.com" ? null : message.name }
                        </p>
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>
        </div>
    );

}
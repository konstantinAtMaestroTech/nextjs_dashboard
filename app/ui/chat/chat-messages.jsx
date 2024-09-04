"use client";

import {useEffect, useRef, useState} from "react";
import Pusher from "pusher-js";
import clsx from 'clsx';
import {handleMentionClick} from "@/app/lib/AutodeskViewer/ViewerAPI/chatCalls"

export default function ChatMessages (props) {

    const {viewer, views} = props;

    const [totalComments, setTotalComments] = useState(props.chat);
    const messageEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    console.log('Viewer from chat messages, ', viewer);

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: "eu",
        });
        let channel = pusher.subscribe(props.roomid);
        channel.bind("message", function (data) {
            console.log('reloading data message', data);
            setTotalComments((prev) => [...prev, data]);
        });
        channel.bind("new-user", function (data) {
            data.name= "admin";
            data.email= "admin@maestro-tech.com";
            console.log('reloading data new-user', data);
            setTotalComments((prev) => [...prev, data]);
        })

        return () => {
            pusher.unsubscribe(props.roomid);
        };
    }, []);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [totalComments]);

    useEffect(() => {

        const handleClick = (event) => handleMentionClick(event, viewer, views)

        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('click', handleClick);
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('click', handleClick);
            }
        };
    }, [viewer]);

    return (
        <div ref={chatContainerRef} className="p-6 flex-grow overflow-y-auto scrollbar">
            <div className="flex flex-col gap-4">
                {totalComments.map((message, index) => (
                    <div key={index}>
                        <div className={clsx(
                            "flex items-center",
                            {
                                "justify-start": message.email == props.activeUser,
                                "justify-end": message.email != props.activeUser && message.email != "admin@maestro-tech.com",
                                "justify-center": message.email == "admin@maestro-tech.com"
                            }
                        )}>
                            <div className={clsx(
                                "rounded-lg p-4 shadow-md self-start",
                                {
                                    "bg-white": message.email == props.activeUser,
                                    "bg-gray-100": message.email != props.activeUser && message.email != "admin@maestro-tech.com",
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
                                "text-left": message.email == props.activeUser,
                                "text-right": message.email != props.activeUser && message.email != "admin@maestro-tech.com",
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
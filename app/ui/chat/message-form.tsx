'use client';

import { useRef, useState, useEffect } from "react";
import {createMessage, StateMessage} from '@/app/lib/db/actions-chat';
import {useActionState} from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import DOMPurify from "dompurify";


export default function MessageForm (data: any) {

    const formRef = useRef(null);
    const [text, setText] = useState('');
    const textareaRef = useRef(null);
    const submitButtonRef = useRef(null); // Add a ref for the submit button
    const initialState: StateMessage = {message:null, errors: {}};
    const [state, formAction] = useActionState(createMessage, initialState);

    useEffect(() => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Reset height to auto to calculate the correct scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    
        // If the content exceeds the max-height, enable scrolling
        if (textarea.scrollHeight > textarea.clientHeight && textarea.scrollHeight > parseInt(textarea.style.maxHeight)) {
          textarea.style.overflowY = 'auto';
        } else {
          textarea.style.overflowY = 'hidden';
        }
    }, [text]);
    
    const handleChange = (e) => {
        const value = e.target.value;
        setText(value);
        const atStandalone = /(^|\s)@(\s|$)/.test(value);
        if (atStandalone) {
            data.onShowCommand();
            data.onSearchQueryChange('');
        } else {
            const atMatch = value.match(/@(\w*)$/);
            if (atMatch) {
                data.onSearchQueryChange(atMatch[1]);
            } else {
                data.onHideCommand();
            }
        }
    };

    function scrollToCommand (index) {
        const commandElement = document.querySelector(`#command-${index}`);
        if (commandElement) {
            commandElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents the default newline behavior
            if (data.showCommand) {
                const commandElement = document.querySelector(`#command-${index}`);
            } else {
                submitButtonRef.current.click();
            }
        } else if (e.key === 'ArrowDown') {
            data.setSelectedCommand((prevIndex) => {
                const newIndex = (prevIndex + 1) % (data.filteredCommandsLength)
                scrollToCommand(newIndex);
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            data.setSelectedCommand((prevIndex) => {
                const newIndex = (prevIndex - 1 + (data.filteredCommandsLength)) % (data.filteredCommandsLength)
                scrollToCommand(newIndex);
                return newIndex;
            });
        }
    };

    

    const handleSubmit = (e) => {
        setText(''); // Clear the text state
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Reset the height of the textarea
    }

    return (
        <div className='flex w-full max-w-lg mx-auto'>
            <form
                action={formAction}
                onSubmit={handleSubmit}
                className="flex gap-2 p-3 w-full bg-white"
            >
                    <textarea
                        id="message"
                        name="message"
                        ref={textareaRef}
                        value={text}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
                        rows="1"
                        style={{ minHeight: '2.5rem', maxHeight: '10rem', lineHeight: '1.25rem' }}
                    />
                    <input
                        type="text"
                        name="room_id"
                        value={data.roomid}
                        hidden
                        readOnly
                    />
                    <button
                        type="submit"
                        className="flex justify-center items-center flex-none mt-auto h-10 w-10 rounded-md border hover:bg-gray-100"
                        ref={submitButtonRef} // Add the ref to the submit button
                        style={{
                            bottom: 0
                        }}
                    >
                        <ArrowUpIcon className="w-5" />
                    </button>
            </form>
        </div>
    );
};
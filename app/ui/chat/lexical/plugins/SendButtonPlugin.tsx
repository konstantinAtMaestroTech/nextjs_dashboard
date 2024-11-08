'use client'

import React, { RefObject } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { $getRoot } from 'lexical';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import {createMessage, StateMessage} from '@/app/lib/db/actions-chat';
import {useActionState} from 'react';

interface SendButtonPluginProps {
    message: string;
    submitButtonRef: RefObject<HTMLButtonElement>;
    contentEditableRef: RefObject<HTMLDivElement>;
    setText: React.Dispatch<React.SetStateAction<string>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    roomid: string;
}

// i dont really like how it is defined but under current circumstances it is fine i think

export default function SendButtonPlugin({
    message,
    submitButtonRef,
    contentEditableRef,
    setText,
    setMessage,
    roomid
}: SendButtonPluginProps): JSX.Element {

    const [editor] = useLexicalComposerContext();
    const initialState: StateMessage = {message:null, errors: {}};
    const [state, formAction] = useActionState(createMessage, initialState);

    const handleSubmit = (e: any) => {

        setText(''); // Clear the text state
        setMessage(''); // Clear the message state
        const contentEditable = contentEditableRef.current;

        if (contentEditable) {
            contentEditable.style.height = 'auto'; // Reset the height of the textarea
        }

        const form = document.getElementById("message-form") as HTMLFormElement;
        form?.reset();
    }

    return (
        <form
            action={formAction}
            onSubmit={handleSubmit}
            id="message-form"
        >
            <input
                type="text"
                name="room_id"
                value={roomid}
                hidden
                readOnly
            />
            <input 
                type="text"
                name="sender"
                value="project"
                hidden
                readOnly
            />
            <input
                type="text"
                name="message"
                value={message}
                hidden
                readOnly
            />
            <button
                type="button"
                className="flex justify-center items-center flex-none mt-auto h-10 w-10 rounded-md border hover:bg-gray-100"
                ref={submitButtonRef}
                onClick={() => {
                    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                    editor.update(() => {
                        const root = $getRoot();
                        root.clear();
                    });

                    const form = document.getElementById("message-form") as HTMLFormElement
                    form?.requestSubmit();
                }}
                style={{
                    bottom: 0
                }}
            >
                <ArrowUpIcon className="w-5" />
            </button>
        </form>
    );
};
'use client';

import {
    $getRoot,
    $getSelection,
    KEY_DOWN_COMMAND,
    KEY_ENTER_COMMAND, 
    COMMAND_PRIORITY_LOW, 
    INSERT_PARAGRAPH_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    CLEAR_EDITOR_COMMAND,
    DELETE_CHARACTER_COMMAND,
    LexicalCommand,
    createCommand,
    COMMAND_PRIORITY_NORMAL,
    $isRangeSelection,
    LexicalEditor,
    EditorState,
    $createTextNode
} from 'lexical';
import { UserNode, $createUserNode } from '@/app/ui/chat/lexical/nodes/UserNode';
import {ViewNode, $createViewNode} from '@/app/ui/chat/lexical/nodes/ViewNode';
import {AutoLinkNode} from '@lexical/link'
import {$generateHtmlFromNodes} from '@lexical/html'
import {useState, useRef, useEffect, useLayoutEffect} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import ChatCommandsPlugin from '@/app/ui/chat/lexical/plugins/chat-commands-lexical'
import {createMessage, StateMessage} from '@/app/lib/db/actions-chat';
import {useActionState} from 'react';

const theme = {};

function onError(error:Error): void {
    console.error(error)
}

export const CONTENT_LINK_COMMAND_USER: LexicalCommand<any> = createCommand();
export const CONTENT_LINK_COMMAND_VIEW: LexicalCommand<any> = createCommand();


export default function MessageFormLexical({users, views, searchQuery, setFilteredCommandLength, roomid, onShowCommand, onHideCommand, onSearchQueryChange, showCommand, setSelectedCommand, filteredCommandsLength, selectedCommand}: any): JSX.Element {

    const [text, setText] = useState('');
    const [message, setMessage] = useState('')
    const contentEditableRef = useRef(null);
    const submitButtonRef = useRef(null);
    const initialState: StateMessage = {message:null, errors: {}};
    const [state, formAction] = useActionState(createMessage, initialState);

    /* const URL_MATCHER =/((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

    const MATCHERS = [
        (text) => {
            const match = URL_MATCHER.exec(text);
            if (match === null) {
            return null;
            }
            const fullMatch = match[0];
            return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
            attributes: { onClick: {handleClick} }, // Optional link attributes
            };
        },
    ]; */

    useEffect(() => {
        const contentEditable = contentEditableRef.current;
        contentEditable.style.height = 'auto'; // Reset height to auto to calculate the correct scrollHeight
        contentEditable.style.height = `${contentEditable.scrollHeight}px`; // Set height to scrollHeight
    
        // If the content exceeds the max-height, enable scrolling
        if (contentEditable.scrollHeight > contentEditable.clientHeight && contentEditable.scrollHeight > parseInt(contentEditable.style.maxHeight)) {
          contentEditable.style.overflowY = 'auto';
        } else {
          contentEditable.style.overflowY = 'hidden';
        }
    }, [text]);

    const initialConfig = {
        namespace: 'MessageFormLexical',
        theme,
        nodes: [AutoLinkNode, UserNode, ViewNode],
        onError,
    };

    function onChange(editorState: EditorState, editor: LexicalEditor) {
        editorState.read(() => {

            // Read the contents of the EditorState here.
            const root = $getRoot();
            const value = root.__cachedText;
            setText(value);
            const htmlValue = $generateHtmlFromNodes(editor);
            setMessage(htmlValue);
            const atStandalone = /(^|\s)@(\s|$)/.test(value);
            if (atStandalone) {
                onShowCommand();
                onSearchQueryChange('');
            } else {
                const atMatch = value.match(/@(\w*)$/);
                if (atMatch) {
                    onSearchQueryChange(atMatch[1]);
                } else {
                    onHideCommand();
                }
            }
 
        });
    }

    const handleSubmit = (e) => {
        console.log('Submission is fired!!');
        setText(''); // Clear the text state
        setMessage(''); // Clear the message state
        const contentEditable = contentEditableRef.current;
        contentEditable.style.height = 'auto'; // Reset the height of the textarea

        document.getElementById("message-form").reset();
    }

    function KeyHandlerPlugin(): null {
        const [editor] = useLexicalComposerContext();
        useEffect(() => {
            return editor.registerCommand(KEY_DOWN_COMMAND, (e: KeyboardEvent) => {
                // Handle event here
                if (e.key === 'ArrowDown') {
                    if (showCommand) {
                        e.preventDefault();
                        setSelectedCommand((prevIndex) => {
                            console.log('prevIndex, ', prevIndex);
                            console.log('filteredCommandsLength, ', filteredCommandsLength)
                            const newIndex = (prevIndex + 1) % (filteredCommandsLength)
                            scrollToCommand(newIndex);
                            console.log('ArrowDown is handled, ', newIndex)
                            return newIndex;
                        });
                    }
                } else if (e.key === 'ArrowUp') {
                    if (showCommand) {
                        e.preventDefault()
                        setSelectedCommand((prevIndex) => {
                            console.log('prevIndex, ', prevIndex);
                            console.log('filteredCommandsLength, ', filteredCommandsLength);
                            const newIndex = (prevIndex - 1 + (filteredCommandsLength)) % (filteredCommandsLength)
                            scrollToCommand(newIndex);
                            console.log('ArrowUp is handled, ', newIndex)
                            return newIndex;
                        });
                    }
                }
                return false;
            }, COMMAND_PRIORITY_LOW)
        },[editor]);
        useLayoutEffect(() => {
            return editor.registerCommand(
              KEY_ENTER_COMMAND,
              (payload: KeyboardEvent) => {
                if (
                  payload.key === 'Enter' && !payload.shiftKey
                ) {
                  // Your logic here
                  const event: KeyboardEvent = payload;
                  event.preventDefault();
                  if (showCommand) {
                    const button = document.getElementById(`command-${selectedCommand}`);
                    if (button) {
                        button.click()
                    }
                    return true;
                  } else {
                    submitButtonRef.current.click();
                    return true;
                  }
                } else if (payload.key === 'Enter' && payload.shiftKey) {
                    const event: KeyboardEvent = payload;
                    event.preventDefault();
                    console.log('Shift+Enter');
                    editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
                    return true;
                }
                return false;
              },
              COMMAND_PRIORITY_CRITICAL
            );
          }, [editor]);
        return null;
    }

    function AddContentLinkPlugin(): null {
        const [editor] = useLexicalComposerContext();
        useEffect(()=>{
            return editor.registerCommand(
                CONTENT_LINK_COMMAND_USER,
                (payload: any) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const {anchor, focus} = selection;

                        anchor.offset -= searchQuery.length + 1;
                        focus.offset = anchor.offset + searchQuery.length + 1;

                        editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true);
                        const user = $createUserNode(`@${payload.name.toString()}`, `user_${payload.name.toString()}`);
                        const whitespace = $createTextNode(' ');
                        selection.insertNodes([user, whitespace]);

                        setSelectedCommand(0);
                    };
                    return true;
                }, COMMAND_PRIORITY_NORMAL)
        }, [editor]);
        useEffect(()=>{
            return editor.registerCommand(
                CONTENT_LINK_COMMAND_VIEW,
                (payload: any) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const {anchor, focus} = selection;

                        anchor.offset -= searchQuery + 1;
                        focus.offset = anchor.offset + searchQuery.length + 1;

                        editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true);
                        const view = $createViewNode(`@${payload.ss_title.toString()}`, `view_${payload.id.toString()}`);
                        const whitespace = $createTextNode(' ');
                        selection.insertNodes([view, whitespace]);

                        setSelectedCommand(0);
                    };
                    return true;
                }, COMMAND_PRIORITY_NORMAL)
        }, [editor]);
        return null
    }

    function SendButtonPlugin(): JSX.Element {
        const [editor] = useLexicalComposerContext()
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
                    name="message"
                    value={message}
                    hidden
                    readOnly
                />
                <button
                    type="button"
                    className="flex justify-center items-center flex-none mt-auto h-10 w-10 rounded-md border hover:bg-gray-100"
                    ref={submitButtonRef} // Add the ref to the submit button
                    onClick={()=>{
                        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                        editor.update(() => {
                            const root = $getRoot();
                            root.clear();
                        })
                        document.getElementById("message-form")?.requestSubmit();
                    }}
                    style={{
                        bottom: 0
                    }}
                >
                    <ArrowUpIcon className="w-5" />
                </button>
            </form>
        )
    }

    function scrollToCommand (index) {
        const commandElement = document.querySelector(`#command-${index}`);
        if (commandElement) {
            commandElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    return (
        <div className='flex w-full gap-2 p-3 w-full bg-white max-w-lg mx-auto'>
            <LexicalComposer initialConfig = {initialConfig}>
                <div className='flex flex-col h-full w-full' >
                    {showCommand && (
                        <ChatCommandsPlugin 
                        users={users} 
                        views={views}
                        searchQuery={searchQuery}
                        selectedCommand={selectedCommand}
                        setFilteredCommandLength={setFilteredCommandLength} 
                    />
                    )}
                    <div className='flex gap-2 p-3 w-full max-w-lg mx-auto bg-white'>
                        <RichTextPlugin 
                            contentEditable={<ContentEditable
                                ref={contentEditableRef} 
                                className="flex-frow-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
                                style={{ minHeight: '2.5rem', maxHeight: '10rem', lineHeight: '1.25rem' }}
                                />}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <SendButtonPlugin />
                    </div>
                </div>
                <HistoryPlugin />
                <OnChangePlugin onChange={onChange} />
                <AddContentLinkPlugin />
                {/* <AutoLinkPlugin matchers={MATCHERS} /> */}
                <KeyHandlerPlugin />
            </LexicalComposer>
        </div>
    );
}


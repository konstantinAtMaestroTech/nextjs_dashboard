'use client'

import {useState, useEffect, useRef} from 'react';

// lexical
import {
    $getRoot,
    LexicalEditor,
    EditorState,
    CommandListener
} from 'lexical';
import {$generateHtmlFromNodes} from '@lexical/html';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin'
//lexicalNodes
import {UserNode} from '@/app/ui/chat/lexical/nodes/UserNode';
import {SupplierNode} from '@/app/ui/chat/lexical/nodes/SupplierNode';
import {ClientViewNode} from '@/app/ui/chat/lexical/nodes/ClientViewNode';
//lexical custom plugins
import SendButtonPlugin from '@/app/ui/chat/lexical/plugins/SendButtonPlugin';
import AddCustomNodePlugin from '@/app/ui/chat/lexical/plugins/AddCustomNodePlugin';
import KeyHandlerPlugin from '@/app/ui/chat/lexical/plugins/KeyHandlerPlugin';
import ChatCommandsPlugin from '@/app/ui/chat/lexical/plugins/ChatCommandsPlugin';
//lexical commands
import {ADD_CLIENT_VIEW_NODE_COMMAND, ADD_SUPPLIER_NODE_COMMAND,ADD_USER_NODE_COMMAND} from '@/app/ui/chat/lexical/commands/Commands'

const theme = {};
function onError(error: Error): void {
    console.error(error)
}

export type Filter = { [key: string]: string };
type Commands = { [key: string]: any[] };

export default function MessageForm(props: any) {

    const {team, views, suppliers, id, session} = props

    // initial Commands. In the client pages chat version the state management of the filtered commands
    // is quite messy (there a two separate states for fileterdCommands and filteredCommands length) and split between diferent components
    // i want to make it a little more organized here

    const commands: Commands = {
        team: team,
        views: views,
        suppliers: suppliers
    }
    

    // the filter must be modified to include the tilte an subtitle for the view case 
    const filter: Filter = {
        team: 'name',
        suppliers: 'name',
        views: 'title' 
    } // this is a helper object that helps to filter commands by the given filter value 

    // Lexical editor config 

    const initialConfig = {
        namespace: 'MessageFormLexical',
        theme,
        nodes: [UserNode, SupplierNode, ClientViewNode],
        onError,
    }

    // lexical Commands

    const lexCommands = [ADD_CLIENT_VIEW_NODE_COMMAND, ADD_SUPPLIER_NODE_COMMAND, ADD_USER_NODE_COMMAND];

    const [showCommand, setShowCommand] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // this is command query state
    const [text, setText] = useState(''); // this is plain text message state
    const [message, setMessage] = useState(''); // this is rich text message state
    const [selectedCommand, setSelectedCommand] = useState(0);
    const [filteredCommands, setFilteredCommands] = useState(commands); // filtered commands

    const contentEditableRef = useRef(null);
    const submitButtonRef = useRef(null); // i do not think it is necessary but for now we work with it

    // effect to update filteredCommands state

    useEffect(() => {
        if (!searchQuery) return;
        setFilteredCommands(
            Object.keys(commands).reduce((acc, commandKey) => {
                if (filter[commandKey]) {
                    acc[commandKey] = commands[commandKey].filter(item =>
                        item[filter[commandKey]].toLowerCase().includes(searchQuery.toLowerCase())
                    )
                }
                return acc;
            }, {} as Commands)
        );  
    }, [searchQuery]);

    // effect to update the message form

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

    // onChange function to be passed to OnChangePlugin
    
    function onChange(editorState: EditorState, editor: LexicalEditor) {
        
        editorState.read(() => {

            const root = $getRoot();
            const value = root.__cachedText; // there must be a better way to access the text value

            if(value) {

                setText(value)
                const htmlValue = $generateHtmlFromNodes(editor);
                setMessage(htmlValue);
                const atStandalone = /(^|\s)@(\s|$)/.test(value);

                if (atStandalone) {
                    setShowCommand(true);
                    setSearchQuery('');
                } else {
                    const atMatch = value.match(/@(\w*)$/);
                    if (atMatch) {
                        setSearchQuery(atMatch[1]);
                    } else {
                        setShowCommand(false)
                    }
                }
            }
        });

    }

    // props for ChatCommandsPlugin

    function handleClick(key:string, item:any, editor: LexicalEditor) {
        if (key === "team") {
            editor.dispatchCommand(ADD_USER_NODE_COMMAND, item);
        } else if (key === "views") {
            editor.dispatchCommand(ADD_CLIENT_VIEW_NODE_COMMAND, item);
        } else if (key === "suppliers") {
            editor.dispatchCommand(ADD_SUPPLIER_NODE_COMMAND, item);
        }
    }

    return (
        <div className='flex w-full gap-2 p-3 w-full bg-white max-w-lg mx-auto'>
            <LexicalComposer initialConfig = {initialConfig}>
                <div className='flex flex-col h-full w-full'>
                    {showCommand && (
                        <ChatCommandsPlugin
                            selectedCommand={selectedCommand}
                            filteredCommands={filteredCommands}
                            clickCallback={handleClick}
                            filter={filter}
                        />
                    )}
                    <div className='flex gap-2 p-3 w-full max-w-lg mx-auto bg-white'>
                        <RichTextPlugin 
                            contentEditable={<ContentEditable 
                                ref={contentEditableRef}
                                className="flex-grow-1 w-full p-2 border border-gray-300 rouded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
                                style={{ minHeight: '2.5rem', maxHeight: '10rem', lineHeight: '1.25rem'}}
                            />}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <SendButtonPlugin 
                            message={message}
                            submitButtonRef={submitButtonRef}
                            contentEditableRef={contentEditableRef}
                            setText={setText}
                            setMessage={setMessage}
                            roomid={id} 
                        />
                    </div>
                </div>
                <HistoryPlugin />
                <OnChangePlugin onChange={onChange} /> 
                <AddCustomNodePlugin 
                    searchQuery={searchQuery}
                    commands={lexCommands}
                    setSelectedCommand={setSelectedCommand}
                />
                <KeyHandlerPlugin 
                    selectedCommand={selectedCommand}
                    setSelectedCommand={setSelectedCommand}
                    filteredCommands={filteredCommands}
                    showCommand={showCommand}
                    submitButtonRef={submitButtonRef}
                />   
            </LexicalComposer> 
        </div>
    )
}
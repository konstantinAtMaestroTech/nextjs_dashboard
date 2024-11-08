'use client'

import {COMMAND_PRIORITY_NORMAL, KEY_DOWN_COMMAND} from 'lexical';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RefObject, useEffect } from 'react';


// this plugin works quite the same intwo chaits that we have so far: arrows up and down to select commands,
// enter to send the message, @ to tag. The onlyl difference is in tracking the # key: in the project chat it to
// reference files in an OSS, while in the views chat as of now it is left without a funciton. I think that 
// hte best solution is to make the plugin accept a key: value object where the key is the key ( :) ) to listen
// and value is the callback function

interface KeyHandlerPluginProps {
    selectedCommand: number;
    setSelectedCommand: React.Dispatch<React.SetStateAction<number>>;
    filteredCommands: { [key: string]: any[] };
    showCommand: boolean;
    submitButtonRef: RefObject<HTMLButtonElement>;
}

function scrollToCommand (index: number) {
    const commandElement = document.querySelector(`#command-${index}`);
    if (commandElement) {
        commandElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

export default function KeyHandlerPlugin({
    selectedCommand,
    setSelectedCommand,
    filteredCommands,
    showCommand,
    submitButtonRef
  }: KeyHandlerPluginProps): null {
    
    const [editor] = useLexicalComposerContext();
    // iterate throught the object
    useEffect(() => {
        return editor.registerCommand(
            KEY_DOWN_COMMAND, (e: KeyboardEvent) => {
                if (e.key === 'ArrowDown') {
                    if (showCommand) {
                        e.preventDefault();
                        setSelectedCommand((prevIndex: number) => {
                            const filteredCommandsLength = Object.values(filteredCommands).reduce((acc, array) => acc + array.length, 0);
                            const newIndex = (prevIndex + 1) % (filteredCommandsLength)
                            scrollToCommand(newIndex);
                            return newIndex;
                        });
                    }
                } else if (e.key === 'ArrowUp') {
                    if (showCommand) {
                        e.preventDefault()
                        setSelectedCommand((prevIndex: number) => {
                            const filteredCommandsLength = Object.values(filteredCommands).reduce((acc, array) => acc + array.length, 0);
                            const newIndex = (prevIndex - 1 + (filteredCommandsLength)) % (filteredCommandsLength)
                            scrollToCommand(newIndex);
                            return newIndex;
                        });
                    }
                } else if ( e.key === 'Enter' && !e.shiftKey ) {
                    e.preventDefault();
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
                }
                return false; 
            }, COMMAND_PRIORITY_NORMAL
        )
    }, [editor, showCommand, filteredCommands, selectedCommand, submitButtonRef])


    return null
}
'use client'

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { LexicalEditor } from 'lexical';
import clsx from 'clsx';
import { Filter } from '@/app/ui/projects/new-project-page/Chat/MessageForm';

interface ChatCommandPluginProps {
    selectedCommand: number;
    filteredCommands: { [key: string]: any[] };
    clickCallback: (key:string, item:any, editor: LexicalEditor ) => void;
    filter: Filter
}

// this mapper should probably somewhere else

export default function ChatCommandsPlugin ({selectedCommand, filteredCommands, clickCallback, filter}: ChatCommandPluginProps) {

    const [editor] = useLexicalComposerContext();

    let count = 0;
    let i_filteredCommands = filteredCommands

    Object.keys(i_filteredCommands).forEach((key) => {
        i_filteredCommands[key].forEach((item) => {
            item.index = count++
        });
    });

    return(
        <div className="mx-3 flex flex-col border border-gray-200 max-h-52 overflow-y-auto rounded-lg scrollbar">
            {Object.entries(i_filteredCommands).map(([key, array]) => (
                <div id={key} key={key} className="flex flex-col rounded-lg">
                    <div id={`div-${key}`} key={`div-${key}`} className="font-light p-2 flex justify-left items-center bg-gray-400 text-sm text-white rounded-t-lg">{key.toUpperCase()}</div>
                    {array.map((item) => (
                        <button
                            id={`command-${item.index}`}
                            key={item.index}
                            className={clsx("font-light text-left p-2 focus:border-transparent focus:outline-none hover:bg-gray-100 focus:bg-gray-100",{
                                'bg-gray-100': item.index == selectedCommand
                            })}
                            tabIndex={0}
                            onClick={() => {clickCallback(key, item, editor)}}
                        >
                            {item[filter[key]]}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}
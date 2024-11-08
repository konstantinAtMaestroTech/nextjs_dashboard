'use client'

import { $isRangeSelection, COMMAND_PRIORITY_NORMAL, LexicalCommand } from "lexical";
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {
    $getSelection,
    $createTextNode,
    DELETE_CHARACTER_COMMAND
} from 'lexical';
import { $createUserNode} from '@/app/ui/chat/lexical/nodes/UserNode';
import { $createSupplierNode} from '@/app/ui/chat/lexical/nodes/SupplierNode';
import { $createClientViewNode} from '@/app/ui/chat/lexical/nodes/ClientViewNode';


interface AddCustomNodePluginProps {
    searchQuery: string;
    commands: LexicalCommand<any>[];
    setSelectedCommand: React.Dispatch<React.SetStateAction<number>>;
}

const mapper = {
    ADD_USER_NODE_COMMAND: function(payload: any) {
        return $createUserNode(`@${payload.name.toString()}`, `user_${payload.email.toString()}_${payload.name.toString()}`);
    },
    ADD_SUPPLIER_NODE_COMMAND: function (payload: any) {
        return $createSupplierNode(`@${payload.name.toString()}`, `supplier_${payload.id.toString()}`);
    },
    ADD_CLIENT_VIEW_NODE_COMMAND: function (payload: any) {
        return $createClientViewNode(`@${payload.title.toString()}|${payload.subtitle.toString()}`, `cview_${payload.id.toString()}`);
    }
}

export default function AddCustomNodePlugin({
    searchQuery,
    commands,
    setSelectedCommand
}: AddCustomNodePluginProps): null {
    const [editor] = useLexicalComposerContext();
    commands.forEach((command) => {
        useEffect(() => {
            return editor.registerCommand(
                command,
                (payload: any) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const {anchor, focus} = selection;

                        anchor.offset -= searchQuery.length + 1;
                        focus.offset = anchor.offset + searchQuery.length + 1;
                        editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true)

                        const commandKey = command.type as keyof typeof mapper;

                        if (commandKey in mapper) {
                            const node = mapper[commandKey](payload);
                            const whitespace = $createTextNode(' ');
                            selection.insertNodes([node, whitespace]);

                            setSelectedCommand(0);
                        }
                    };
                    return true;
                }, COMMAND_PRIORITY_NORMAL
            )
        }, [editor])
    })
    return null
}
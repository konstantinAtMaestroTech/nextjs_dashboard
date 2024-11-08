import {ChatBubbleLeftRightIcon, TagIcon, FolderOpenIcon, TableCellsIcon, CursorArrowRaysIcon, EyeIcon} from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';

interface IconProps {
    activeMenu: string;
    setActiveMenu: Dispatch<SetStateAction<string>>;
}

export function ChatIcon({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "chat" ? setActiveMenu("defalut") : setActiveMenu("chat")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
           'bg-[rgba(255,60,0)]': activeMenu === "chat",
           'bg-white': activeMenu !== "chat"
        })} onClick={handleClick}>
            <ChatBubbleLeftRightIcon className={clsx("w-5", {
                'text-white': activeMenu === "chat",
                'text-black': activeMenu !== "chat"
            })}/>
        </button>
    );
}

export function ProductionTag({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "production_tag" ? setActiveMenu("defalut") : setActiveMenu("production_tag")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
           'bg-[rgba(255,60,0)]': activeMenu === "production_tag",
           'bg-white': activeMenu !== "production_tag"
        })} onClick={handleClick}>
            <TagIcon className={clsx("w-5", {
                'text-white': activeMenu === "production_tag",
                'text-black': activeMenu !== "production_tag"
            })} />
        </button>
    );
}

export function ComponentsTable({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "components" ? setActiveMenu("defalut") : setActiveMenu("components")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
            'bg-[rgba(255,60,0)]': activeMenu === "components",
            'bg-white': activeMenu !== "components"
        })} onClick={handleClick}>
            <FolderOpenIcon className={clsx("w-5", {
                'text-white': activeMenu === "components",
                'text-black': activeMenu !== "components"
            })} />
        </button>
    );

}

export function TenderPackageSchema({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "tpschema" ? setActiveMenu("defalut") : setActiveMenu("tpschema")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
            'bg-[rgba(255,60,0)]': activeMenu === "tpschema",
            'bg-white': activeMenu !== "tpschema"
        })} onClick={handleClick}>
            <TableCellsIcon className={clsx("w-5", {
                'text-white': activeMenu === "tpschema",
                'text-black': activeMenu !== "tpschema"
            })} />
        </button>
    );

}

export function CurrentSelection({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "currentselection" ? setActiveMenu("defalut") : setActiveMenu("currentselection")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
            'bg-[rgba(255,60,0)]': activeMenu === "currentselection",
            'bg-white': activeMenu !== "currentselection"
        })} onClick={handleClick}>
            <CursorArrowRaysIcon className={clsx("w-5", {
                'text-white': activeMenu === "currentselection",
                'text-black': activeMenu !== "currentselection"
            })} />
        </button>
    );

}

export function ViewAndPublish({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "view" ? setActiveMenu("defalut") : setActiveMenu("view")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
            'bg-[rgba(255,60,0)]': activeMenu === "view",
            'bg-white': activeMenu !== "view"
        })} onClick={handleClick}>
            <EyeIcon className={clsx("w-5", {
                'text-white': activeMenu === "view",
                'text-black': activeMenu !== "view"
            })} />
        </button>
    );

}
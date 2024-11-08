import {QrCodeIcon, TableCellsIcon} from '@heroicons/react/24/outline';
import { IconProps } from './Icons';
import clsx from 'clsx';



export function Scanner({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "scanner" ? setActiveMenu(undefined) : setActiveMenu("scanner")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
           'bg-[rgba(255,60,0)]': activeMenu === "scanner",
           'bg-white': activeMenu !== "scanner"
        })} onClick={handleClick}>
            <QrCodeIcon className={clsx("w-5", {
                'text-white': activeMenu === "scanner",
                'text-black': activeMenu !== "scanner"
            })} />
        </button>
    );
}

export function SupersetData({ activeMenu, setActiveMenu }: IconProps) {

    const handleClick = () => {
        activeMenu === "superset-data" ? setActiveMenu(undefined) : setActiveMenu("superset-data")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
           'bg-[rgba(255,60,0)]': activeMenu === "superset-data",
           'bg-white': activeMenu !== "superset-data"
        })} onClick={handleClick}>
            <TableCellsIcon className={clsx("w-5", {
                'text-white': activeMenu === "superset-data",
                'text-black': activeMenu !== "superset-data"
            })} />
        </button>
    );
}
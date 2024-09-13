import {CameraIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export function CreateSuperset({ activeMenu, setActiveMenu }) {

    const handleClick = () => {
        activeMenu === "create-superset" ? setActiveMenu(false) : setActiveMenu("create-superset")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
           'bg-[rgba(255,60,0)]': activeMenu === "create-superset",
           'bg-white': activeMenu !== "create-superset"
        })} onClick={handleClick}>
            <CameraIcon className={clsx("w-5", {
                'text-white': activeMenu === "create-superset",
                'text-black': activeMenu !== "create-superset"
            })} />
        </button>
    );
}
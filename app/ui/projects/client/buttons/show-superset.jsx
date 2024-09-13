import {EyeIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export function SupersetIcon({ activeMenu, setActiveMenu }) {

    const handleClick = () => {
        activeMenu === "superset" ? setActiveMenu(false) : setActiveMenu("superset")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
           'bg-[rgba(255,60,0)]': activeMenu === "superset",
           'bg-white': activeMenu !== "superset"
        })} onClick={handleClick}>
            <EyeIcon className={clsx("w-5", {
                'text-white': activeMenu === "superset",
                'text-black': activeMenu !== "superset"
            })} />
        </button>
    );
  }
import {ChatBubbleLeftRightIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export function ChatIcon({ activeMenu, setActiveMenu }) {

    const handleClick = () => {
        activeMenu === "chat" ? setActiveMenu(false) : setActiveMenu("chat")
    }

    return (
        <button className={clsx("rounded-md border p-2 shadow-lg",{
           'bg-[rgba(255,60,0)]': activeMenu === "chat",
           'bg-white': activeMenu !== "chat"
        })} onClick={handleClick}>
            <ChatBubbleLeftRightIcon className={clsx("w-5", {
                'text-white': activeMenu === "chat",
                'text-black': activeMenu !== "chat"
            })} />
        </button>
    );
  }
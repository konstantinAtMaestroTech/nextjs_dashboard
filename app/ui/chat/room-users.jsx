'use client'

export default function RoomUsers(props) {

    const {users} = props;

    const handleUserClick = (user) => {
        // Handle user click, e.g., open chat with that user
        console.log('Clicked on user:', user);
    };

    return (
        <div className="">
            <div className="h-0.5 bg-gray-200"/>
            <div className="flex space-x-2 p-2 overflow-x-auto scrollbar">
                {users.map((user, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                        onClick={() => handleUserClick(user)}
                    >
                        <div
                            className="w-10 h-10 bg-cover bg-center rounded-full border-2 border-gray-300 hover:border-gray-500"
                        />
                        <div className="mt-2 text-xs text-center whitespace-normal">
                            {user.name.split(' ').map((part, i) => (
                                <span key={i} className="block">{part}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-0.5 bg-gray-200"/>
        </div>
    )
}

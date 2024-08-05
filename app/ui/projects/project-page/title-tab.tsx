export default function TitleTab({ title }: { title: string }) {
    return (
        <div
            className='flex h-10 items-center rounded-lg bg-[#646e6e] px-4 m-1 text-sm font-medium text-white'
        >
            <span>{title}</span>
        </div>
    )
}
export default function SubtitleTab({ subtitle }: { subtitle: string }) {
    return (
        <div
            className='flex h-6 items-center rounded-lg bg-[#9BAAAA] px-4 m-1 text-sm font-medium text-white'
        >
            <span>{subtitle}</span>
        </div>
    )
}
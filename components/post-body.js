export default function PostBody({ content }) {
    return (
        <div className="max-w-2xl mx-auto">
            <div
                className='markdown'
            >
            <p>{content}</p>
            </div>
        </div>
    )
}
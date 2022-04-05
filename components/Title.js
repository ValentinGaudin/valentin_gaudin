export default function Title({
    name,
}) {
    return  (
        <>
        <div>
            <h4 id="title" className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
                <span></span>{name}
            </h4>
        </div>
        </>
    );
};
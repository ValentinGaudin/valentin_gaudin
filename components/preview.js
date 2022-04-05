import DateFormatter from './dateFormatter';
import CoverImage from './coverImage';
import Link from 'next/link';

export default function PostPreview({
    title,
    coverImage,
    date,
    excerpt,
    slug,
}) {
return (
    <div className="card">
        <div className=" mb-5 mx-auto w-full">
            <CoverImage
                slug={slug}
                title={title}
                src={coverImage}
                height={378}
                width={566}
            />
        </div>
        <h4 className="text-2xl mb-3 leading-snug title w-11/12">
            
            <Link as={`/work/${slug}`} href="/work/[slug]">
                <a className="hover:underline ">
                <span></span>
                {title}
                </a>
            </Link>
        </h4>
        <div className="text-lg mb-4">
            <DateFormatter dateString={date} />
        </div>
        
        <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
        <p className="text-lg leading-relaxed mb-4">Valentin Gaudin</p>
    </div>
    );
};
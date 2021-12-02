import DateFormatter from '../components/date-formatter';
import CoverImage from './cover-image';
import Link from 'next/link';

export default function PostPreview({
    title,
    coverImage,
    date,
    link,
    excerpt,
    slug,
}) {
return (
    <div>
        <div className="mb-5 w-8/12 mx-auto">
            <CoverImage
                slug={slug}
                title={title}
                src={coverImage}
                height={378}
                width={566}
            />
        </div>
        <h4 className="text-3xl mb-3 leading-snug">
            
            <Link as={`/work/${slug}`} href="/work/[slug]">
                <a className="hover:underline">
                <span></span>
                {title}
                </a>
            </Link>
        </h4>
        <div className="text-lg mb-4">
            <DateFormatter dateString={date} />
        </div>
        <p className="text-lg leading-relaxed mb-4">{link}</p>
        <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
        <p className="text-lg leading-relaxed mb-4">Valentin Gaudin</p>
    </div>
    )
}
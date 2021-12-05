import DateFormatter from '../components/date-formatter'
import CoverImage from '../components/cover-image'
import Link from 'next/link'

export default function HeroPost({
    title,
    coverImage,
    date,
    excerpt,
    slug,
}) {
    return (
        <section className="card">
            <div className="mb-8 md:mb-16 mt-10 h-4/6 w-8/12 mx-auto">
                <CoverImage
                title={title}
                src={coverImage}
                slug={slug}
                height={200}
                width={240}
                />
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 ">
                <div>
                    <h4 className="mb-4 text-4xl lg:text-6xl leading-tight">
                        <Link as={`/work/${slug}`} href="/work/[slug]">
                        <a className="hover:underline">
                        <span></span>
                        {title}
                        </a>
                        </Link>
                    </h4>
                    <div className="mb-4 md:mb-0 text-lg">
                        <DateFormatter dateString={date} />
                    </div>
                </div>
                    <div>
                        <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
                    </div>
            </div>
        </section>
    )
}
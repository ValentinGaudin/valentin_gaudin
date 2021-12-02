import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

export default function CoverImage({ 
    title,
    src,
    slug,
    width,
    height
}) {
    const image = (
    <Image
        src={src}
        height={height}
        width={width}
        alt={`Cover Image for ${title}`}
        className={cn('shadow-sm', {
        'hover:shadow-md transition-shadow duration-200': slug,
        })}
        layout="responsive"

    />
    )
    return (
        <div className="sm:mx-0 ">
        {slug ? (
            <Link as={`/work/${slug}`} href="/work/[slug]">
                <a aria-label={title}>{image}</a>
            </Link>
        ) : (
            image
        )}
        </div>
    )
}
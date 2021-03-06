import Preview from './preview'

export default function MoreStories({ posts }) {
    return (
        <section>
            <h4 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
                <span></span>
                About me and my Work :
            </h4>
            <div className="grid md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
                {posts.map((post) => (
                    <Preview
                        key={post.slug}
                        title={post.title}
                        coverImage={post.coverImage}
                        date={post.date}
                        author={post.author}
                        slug={post.slug}
                        excerpt={post.excerpt}
                    />
                ))}
            </div>
        </section>
    );
};
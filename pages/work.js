import Footer from '../components/Footer';
import MoreStories from '../components/morePosts';
import HeroPost from '../components/hero-post';
import Layout from '../components/Layout';
import Container from '../components/container';
import { getAllPosts } from '../lib/api';
import Header from '../components/Header';
import Title from '../components/Title';

export default function Work({ allPosts }) {

    const heroPost = allPosts[0]
    const morePosts = allPosts.slice(1)

    return (
        <div>
            <Header/>
                <Title name="Work"/>
                <Layout>
                    <Container>
                        {heroPost && (
                            <HeroPost
                            title={heroPost.title}
                            coverImage={heroPost.coverImage}
                            date={heroPost.date}
                            author={heroPost.author}
                            slug={heroPost.slug}
                            excerpt={heroPost.excerpt}
                            />
                        )}
                        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
                    </Container>
                </Layout>
            <Footer />
        </div>
    );
};
    export async function getStaticProps() {
        const allPosts = getAllPosts([
        'title',
        'date',
        'slug',
        'author',
        'coverImage',
        'excerpt',
        ])
    
        return {
        props: { allPosts },
        }
    }

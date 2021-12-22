import Footer from '../component/Footer';
import Container from '../component/container'
import MoreStories from '../component/more-post'
import HeroPost from '../component/hero-post'
import Layout from '../component/Layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Header from '../component/Header';
import Title from '../component/Title';


export default function Work({ allPosts }) {

    const heroPost = allPosts[0]
    const morePosts = allPosts.slice(1)

    return (
        <div>
                <Header/>
                <Title name="Work"/>
                <Layout>
                <Head>
                </Head>
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

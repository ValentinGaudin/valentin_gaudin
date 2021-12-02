import Footer from '../components/Footer';
import Container from '../components/container'
import MoreStories from '../components/more-post'
import HeroPost from '../components/hero-post'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Nav from '../components/Nav';
import Header from '../components/header';

export default function Work({ allPosts }) {

    const heroPost = allPosts[0]
    const morePosts = allPosts.slice(1)

    return (
        <div>
                <Header 
                info="Work"
                />
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

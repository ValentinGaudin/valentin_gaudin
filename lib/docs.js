import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../component/container'
import PostBody from '../component/post-body'
import Header from '../component/Header'
import PostHeader from '../component/post-header'
import Layout from '../component/layout'
import { getPostBySlug, getAllPosts } from '../lib/api'
import PostTitle from '../component/post-title'
import markdownToHtml from './markdownToHtml'

export default function Post({ post, morePosts, preview }) {
    const router = useRouter()
    if (!router.isFallback && !post?.slug) {
        return <ErrorPage statusCode={404} />
    }
    return (
        <Layout preview={preview}>
          <Header />
          <Container>
            {router.isFallback ? (
            <PostTitle>Loading…</PostTitle>
            ) : (
            <>
                <article className="mb-32">
                <PostHeader
                    title={post.title}
                    coverImage={post.coverImage}
                    date={post.date}
                    author={post.author}
                />
                <PostBody content={post.content} />
                </article>
            </>
            )}
        </Container>
        </Layout>
    )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../component/container'
import PostBody from '../../component/postBody'
import Headerpost from '../../component/HeaderPost'
import Layout from '../../component/Layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../component/postTitle'
import markdownToHtml from '../../lib/markdownToHtml'
import Link from 'next/link'
import Header from '../../component/Header'
import Title from '../../component/Title';

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (

    <Layout preview={preview}>
      <Header />
      <Title name="Work" />
      <Container >
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Headerpost
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content}/>
                <div className="text-center mt-4" >
                    <Link as={post.link} href="[post.link]">
                    <a> 
                      {post.link}
                    </a>
                    </Link>
                </div>
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
    'link',
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

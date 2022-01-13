import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/postBody'
import Headerpost from '../../components/HeaderPost'
import Layout from '../../components/Layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/postTitle'
import markdownToHtml from '../../lib/markdownToHtml'
import Link from 'next/link'
import Header from '../../components/Header'
import Title from '../../components/Title';

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

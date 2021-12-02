import Head from 'next/head'
const favicon = './assets/Mario.png'

export default function Meta() {
    return (
        <Head>
            <link rel="shortcut icon" type="image/png" href={favicon} />
            <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
            <meta
                name="description"
                content="A statically blog using Next.js and MarkDown."
            />
            <title>Valentin Gaudin</title>
        </Head>
    )
}
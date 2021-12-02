import Head from 'next/head'
const favicon = './assets/favicon/Mario.png'

export default function Meta() {
    return (
        <Head>
            <link rel="manifest" href="/favicons/site.webmanifest" />
            <meta name="msapplication-TileColor" content="#0e1212" />
            <meta name="msapplication-config" content="/assets/favicons/browserconfig.xml" />
            <meta name="theme-color" content="#0e1212" />
            <link rel="shortcut icon" type="image/png" href={favicon} />
            <link rel="alternate" type="application/rss+xml" href="/feed.xml"
            />
            <meta
                name="description"
                content="My portfolio about me and my work on web devlopment using Next.js "
            />
            <title>Valentin Gaudin</title>
        </Head>
    )
}
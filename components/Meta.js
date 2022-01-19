import Head from 'next/head'
import { DESCRIPTION, NAME } from '../lib/constant'

export default function Meta() {
    return (
        <Head>
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/..//favicons/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/..//favicons/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/..//favicons/favicon-16x16.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="192x192"
                href="/..//favicons/android-chrome-192x192.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="512x512"
                href="/..//favicons/android-chrome-512x512.png"
            />
            <link rel="manifest" href="/..//favicons/site.webmanifest" />
            <link rel="shortcut icon" type="image/png" href="/..//favicons/favicon.ico" />
            <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
            <meta name="msapplication-TileColor" content="#0e1212" />
            <meta name="theme-color" content="#0e1212" />
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content={DESCRIPTION} />
            <title>{NAME}</title>
        </Head >
    )
}
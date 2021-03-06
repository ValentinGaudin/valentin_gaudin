import Head from 'next/head'

export default function Meta() {
    return (
        <Head>
            <meta charSet="UTF-8" />
            <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
            <meta name="msapplication-TileColor" content="#0e1212" />
            <meta name="theme-color" content="#0e1212" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
            <meta name="description" content="Rendez-vous sur le port-folio de Valentin Gaudin, étudiant en développement web au sein de la Wild Code School de Lyon, retrouvez ses réalisations et n'hésitez pas à prendre contact. Etudiant PHP, orienté Green IT et design." />
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
        </Head >
    );
};
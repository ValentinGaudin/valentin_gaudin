import Head from 'next/head'
import Meta from './Meta';
import Navigation from './Nav';

export default function Header( meta ){
    return (
        <div>
            <Head>
                <title>Valentin Gaudin {meta.title} </title>
            </Head>
            <Meta />
            <Navigation />
                <p className="md:hidden p-5 my-5">
                    Valentin Gaudin
                </p>
        </div>
    )
}
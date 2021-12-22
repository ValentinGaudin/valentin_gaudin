import Meta from '../component/Meta'


export default function Layout({children}) {
    return (
        <>
        <Meta />
        <div className="min-h-screen">
            <main>{children}</main>
        </div>
        </>
    )
}
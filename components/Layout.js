import Meta from '../components/Meta'


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
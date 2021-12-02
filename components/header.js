import Link from 'next/link'
import Meta from './meta';
import MobileNav from './MobileNav';
import Navigation from './Nav';


export default function Header({info}) {
    info
    return (
        <div>
            <Meta />
            <Navigation />
            <MobileNav />
                <h4 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
                <span></span>{info}()
                </h4>
        </div>
    )
}
import Meta from './Meta';
import Navigation from './Nav';

export default function Header({info}) {
    info
    return (
        <div>
            <Navigation />
            <Meta />
            <p className="md:hidden p-5 mx-5 my-5">Valentin Gaudin</p>
                <h4 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
                <span></span>{info}()
                </h4>
        </div>
    )
}
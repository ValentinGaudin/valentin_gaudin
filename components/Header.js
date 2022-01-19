import Meta from './Meta';
import Navigation from './Nav';
$
export default function Header(){
    return (
        <div>
            <Meta />
            <Navigation />
                <p className="md:hidden p-5 my-5">
                    Valentin Gaudin
                </p>
        </div>
    )
}
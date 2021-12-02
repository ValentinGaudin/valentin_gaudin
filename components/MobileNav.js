import Link from 'next/link'
import { useState } from 'react';
import Image from 'next/image'


const MobileNav = () => {

    const [showLinks, setShowLinks] = useState(false)
    const handleShowLinks = () => {
        setShowLinks(!showLinks)
    }


    return (
        <div className="navbar md:hidden fixed right-10 bottom-10 z-10">
            <div className={`${showLinks ? "shownav" : "hidenav"} nav`}>
                <nav className="navigation flex flex-row text-md mb-5">
                    <ul className="navbar__links" id="navBG">
                        <li className="navbar__link">
                            <Link href="/" >
                            .Home()
                            </Link>
                        </li>
                        <li className="navbar__link">
                            <Link href="/Work">
                            .Work()
                            </Link>                            
                        </li>
                        <li className="navbar__link">
                            <Link href="/Contact">
                            .Contact()
                            </Link>
                        </li>
                        <li className="navbar__link">
                            <Link href="/Contact">
                            .CV()
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="absolute right-0 bottom-0 z-10">
                <button onClick={handleShowLinks}>
                    <Image src="https://img.icons8.com/nolan/64/menu-2.png" width="30" height="30" alt="Bouton de menu" />
                </button>
            </div>
        </div>
    );
};

export default MobileNav;

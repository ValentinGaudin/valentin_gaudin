import React from 'react';
import Link from 'next/link';

const MobileNav = () => {

    function toggleMenu() {
        const btn = document.getElementById('buttonMenu');
        const nav = document.getElementById('menu');
        if (getComputedStyle(btn).display === 'block') {
        btn.classList.toggle('open');
        nav.classList.toggle('flex');
        nav.classList.toggle('hidden');
        document.body.classList.toggle('non-scrollable');
        }
    }

    return (
        <div className="navbar md:hidden fixed w-full z-10">
                <nav id='site-menu' className="navigation text-md w-full justify-center items-center mt-10" >
                        <div className="z-40 w-full md:w-auto mx-auto flex flex-row-reverse items-center absolute right-5 top-5">
                            <button
                                id='buttonMenu'
                                aria-label='Toggle Mobile Menu'
                                className='hamburger block md:hidden focus:outline-none absolute right-5'
                                type='button'
                                onClick={toggleMenu}
                            >
                            <span className='hamburger_top-bun'></span>
                            <span className='hamburger_middle-bun'></span>
                            <span className='hamburger_bottom-bun'></span>
                            </button>
                        </div>
                    <div id="menu" className="link no-scrollbar w-full md:self-center md:flex flex-col items-center h-screen hidden overflow-x-scroll">
                    <ul className="navbar__links mt-10" id="navigation">
                        <li className="link">
                            <Link  onClick={toggleMenu} href="/" >
                            .Home()
                            </Link>
                        </li>
                        <li className="link">
                            <Link  onClick={toggleMenu} href="/work">
                            .Work()
                            </Link>                            
                        </li>
                        <li  className="link">
                            <Link  onClick={toggleMenu} href="/contact">
                            .Contact()
                            </Link>
                        </li>
                        <li className="navbar__link">
                            <a href="/CV/CV_Valentin_Gaudin.pdf" target="_blank" rel="noopener noreferrer"  onClick={toggleMenu}>
                            .Cv()
                            </a>
                        </li>
                    </ul>
                    </div>
                </nav>
        </div>
    );
};

export default MobileNav;

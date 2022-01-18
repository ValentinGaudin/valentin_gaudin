import React from 'react';
import Link from 'next/link'

function Navigation () {

    const img1 = '/assets/img/bg1.jpg';
    const img2 = '/assets/img/bg2.jpg';
    const img3 = '/assets/img/bg3.jpg';
    const img5 = '/assets/img/bg5.jpg';
    const img6 = '/assets/img/bg6.jpg';
    const img7 = '/assets/img/bg7.jpg';

    const img = [img1, img2, img3, img5, img6, img7];

    const randomize = Math.floor(Math.random()*img.length);
    
    const StyleSheet = {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundImage: `url('${img[randomize]}')`,
    };
    
    return (
    <>
    <div className="home theGrid mt-10 img rounded-2xl w-11/12 h-4/12 mx-auto hidden md:block z-10" style={ StyleSheet }>
        <div className="text tracking-widest top-8 ml-10 relative md:text-1xl lg:text-2xl mix-blend-color-dodge w-20">

            <p><strong>V</strong><span>alentin</span></p>

        </div> 
                <div className="nav relative left-52 ">
                    <nav className="nav navigation relative left-0">
                        <ul className="flex flex-row justify-start w-full text-purple-dark" id="navBG">
                            <li>
                                <Link href="/">
                                .Home()
                                </Link>
                            </li>
                            <li>
                                <Link href="/work">
                                .Work()
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact">
                                .Contact()
                                </Link>
                            </li>
                            <li>
                                <a href="/CV/CV_Valentin_Gaudin.pdf" target="_blank" rel="noopener noreferrer">
                                .Cv()
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
    </>
    );
};

export default Navigation;

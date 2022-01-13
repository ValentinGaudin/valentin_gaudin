import React from 'react';
import Link from 'next/link'
import style from '../public/assets/styles/random.module.scss';
import Image from 'next/image';

function Navigation () {


    function randomize(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    function preventRefresh(e) {
        e.preventDefault();
    }

    return (
        <>
        <div  className="home theGrid img rounded-2xl mx-auto hidden md:block z-10 mt-5">
            <div className='w-11/12 h-full mx-auto'>
                <Image 
                    className={style.styleSheet} 
                    src={`/assets/img/bg`+`${randomize(1,6)}`+`.jpg`} 
                    layout='responsive'
                    objectFit='fill'
                    objectPosition={'center'}
                    height={'15w'}
                    width={"100w"}
                    alt="Background Image"
                />
            </div>
            <div className="text tracking-widest left-20 top-20 md:text-1xl lg:text-2xl w-20 z-50 absolute mix-blend-overlay">
                <p className=""><strong>V</strong><span>alentin</span></p>
                <div className="nav relative left-40 ">
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
        </div> 
            {preventRefresh}
    </>
    );
};

export default Navigation;

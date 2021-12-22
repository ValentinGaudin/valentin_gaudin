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
        <div  className="home theGrid img rounded-2xl mx-auto hidden md:block z-10">
            <div className='w-8/12 h-7/12 mx-auto'>
                <Image 
                    className={style.styleSheet} 
                    src={`/assets/img/bg`+`${randomize(1,6)}`+`.jpg`} 
                    layout='fill'
                    objectFit='cover'
                    objectPosition={'center'}
                    height={'10%'}
                    alt="Background Image"
                />
            </div>
        
        
            <div className="text tracking-widest ml-10 top-10 md:text-1xl lg:text-2xl mix-blend-color-dodge w-20 z-50 absolute">

                <p><strong>V</strong><span>alentin</span></p>

            
                <div className="nav">
                    <nav className="nav navigation mix-blend-color-burn relative left-0">
                        <ul className="flex flex-row justify-start w-full" id="navBG">
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

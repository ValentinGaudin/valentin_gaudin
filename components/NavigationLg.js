import React from 'react';
import Link from 'next/link'

const img1 = '/assets/img/bg1.jpg';
const img2 = '/assets/img/bg2.jpg';
const img3 = '/assets/img/bg3.jpg';
const img5 = '/assets/img/bg5.jpg';
const img6 = '/assets/img/bg6.jpg';
const img7 = '/assets/img/bg7.jpg';
const img8 = '/assets/img/bg8.jpg';


const Navigation=() => {


    const img = [img1, img2, img3, img5, img6, img7, img8];
    const randomize = Math.floor(Math.random()*img.length);
    
    const StyleSheet ={
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundImage: `url('${img[randomize]}')`,
    };

    function preventRefresh(e) {
        e.preventDefault();
    }
    
    return (
        

    <div className="home theGrid img rounded-2xl w-11/12 mx-auto hidden md:block z-10" style={ StyleSheet }>
        <div className="text tracking-widest left-10 top-10 relative md:text-1xl lg:text-2xl mix-blend-color-dodge">

            <p><strong>V</strong><span>alentin</span></p>

        </div> 
            <div className="nav" >
                <nav className="navigation w-11/12 mix-blend-color-burn">
                    <ul className="flex flex-row justify-end" id="navBG">
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
                            <Link href="/contact">
                            .Cv()
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        {preventRefresh}
    </div>
    );
};

export default Navigation;
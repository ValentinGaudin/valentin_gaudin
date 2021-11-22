import React from 'react';
import { NavLink } from 'react-router-dom';

import img1 from '../assets/img/bg1.jpg';
import img2 from '../assets/img/bg2.jpg';
import img3 from '../assets/img/bg3.jpg';
import img4 from '../assets/img/bg4.jpg';
import img5 from '../assets/img/bg5.jpg';
import img6 from '../assets/img/bg6.jpg';
import img7 from '../assets/img/bg7.jpg';
import img8 from '../assets/img/bg8.jpg';

const Navigation=() => {
    const img = [img1, img2, img3, img4, img5, img6, img7, img8];
    const randomize = Math.floor(Math.random()*img.length);
    
    const StyleSheet ={
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundImage: `url('${img[randomize]}')`,
    };

    return (

    <div className="home theGrid img rounded-2xl mt-2 w-11/12 mx-auto hidden md:block" style={ StyleSheet }>
        <div className="text flex tracking-widest left-10 top-32 relative text-4xl">

            <p><strong>V</strong><span>alentin</span></p>

        </div> 
            <div className="nav" >
                <nav className="navigation p-10 w-11/12">
                    <ul class="flex flex-row justify-end -right-12"id="navBG">
                        <li>
                            <NavLink exact to="/" activeClassName="nav-active ">
                            .About()
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/Work" activeClassName="nav-active">
                            .Work()
                            </NavLink>                            
                        </li>
                        <li>
                            <NavLink exact to="/Contact" activeClassName="nav-active">
                            .Contact()
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
    </div>
    );
};

export default Navigation;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';


const MobileNav = () => {

    const [showLinks, setShowLinks] = useState(false)
    const handleShowLinks = () => {
        setShowLinks(!showLinks)
    }


    return (
        <div className="navbar md:hidden fixed right-10 bottom-10">
            <div className={`${showLinks ? "shownav" : "hidenav"} nav`}>
                <nav className="navigation flex flex-row-reverse text-md p-10 mb-5">
                    <ul classnName="navbar__links"id="navBG">
                        <li className="navbar__link">
                            <NavLink exact to="/" activeClassName="nav-active">
                            .About()
                            </NavLink>
                        </li>
                        <li className="navbar__link">
                            <NavLink exact to="/Work" activeClassName="nav-active">
                            .Work()
                            </NavLink>                            
                        </li>
                        <li className="navbar__link">
                            <NavLink exact to="/Contact" activeClassName="nav-active">
                            .Contact()
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

            <button onClick={handleShowLinks}>
                <img src="https://img.icons8.com/nolan/64/menu-2.png" className="absolute right-5 bottom-5" />
            </button>

        </div>
    );
};

export default MobileNav;

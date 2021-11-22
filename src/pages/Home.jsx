import React from 'react';
import MobileNav from '../components/MobileNav';
import Navigation from '../components/Navigation';
import About from './About';

const Home = () => {
    return (
        <div>
            <Navigation />
            <MobileNav />
            <About />
        </div>
    );
};

export default Home;
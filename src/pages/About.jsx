import React from 'react';
import git from '../assets/img/github.svg';
import linkedin from '../assets/img/linkedin.svg';

const About = () => {
    return (
        <div className="about">

                <div className="containerBoy">
                    <section id="littleName">
                        <div className="littleBoy md:text-5xl text-xl relative top-20 left-20 space-y-5">
                            <h1>Hello There,<span></span></h1>
                            <h1>I'm <span></span></h1>
                            <h1>Valentin <span></span></h1>
                            <h1>Gaudin <span></span></h1>
                            <h1>A Jr. web <span></span></h1>
                            
                        </div> 
                    </section>

                    <aside className="social">
                        <div className="link absolute md:-bottom-20 lg:top-80 right-0 w-24 h-24 text-sm md:text-xl p-1 lg:w-80">
                            <figure>
                                <div className="relative right-20">
                                    <img src={ git } alt="Logo Github" className="git"/>
                                    <figcaption className="" >github.com/ValentinGaudin</figcaption>
                                </div>
                            </figure>
                            <figure>
                                <div className="relative right-10">
                                    <img src={ linkedin } alt="Logo Linkedin" className="linkedin"/>
                                    <figcaption>linkedin.com/in/gaudinvalentin/</figcaption>
                                </div>
                            </figure>
                        </div>
                    </aside>
                </div>

        </div>
    );
};

export default About;
const Xperience = () => {

    return (
        <div className="about containerBoy top-24 my-10 md:my-36" id="valentin">

        <section id="name">
            <div className="littleBoy md:text-4xl text-md tracking-wider ml-20">
                <h1 className="text-purple">Hello There, I&apos;m <span></span></h1>
                <h1>Valentin Gaudin<span></span></h1>
                <h1>A Jr. web <span></span></h1>
            </div> 
        </section>

        <aside className="flex mt-8 md:text-2xl text-lg w-75 ml-10" id="description">
            <p>
                Ex-soldier of an elite unit, rigorous, motivated and organized, in web developer training at the Wild Code School of Lyon
            </p>
        </aside>

        <section className="mt-24 md:my-36">
            <div className="experience">
                <h1 className="md:text-4xl text-2xl font-bold w-full" id="skills">
                    .Skills()
                </h1>
                        <div className="my-5 grid grid-cols-3 gap-4">
                            <div className="my-5 w-full">
                                <div className="my-4 md:text-4xl text-xl md:ml-8 md:mt-10 ml-5" id="frontend">
                                    .Front-End()
                                </div>
                                <div>
                                    <ul className="title md:text-xl text-sm md:ml-20 ml-12 ">
                                        <li className="item"> <span></span>HTML 5</li>
                                        <li className="item"> <span></span>CSS / SCSS </li>
                                        <li className="item"> <span></span>Bootstrap & Tailwind</li>
                                        <li className="item"> <span></span>JavaScript & ES6</li>
                                        <li className="item"> <span></span>React</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="my-5">
                                <div className=" my-4 md:text-4xl text-xl md:ml-8 md:mt-10 ml-5" id="backend">
                                    .Back-End()
                                </div>
                                <div>
                                    <ul className="title md:text-xl text-sm md:ml-20 ml-12">
                                        <li className="item"> <span></span>PHP</li>
                                        <li className="item"> <span></span>Symfony & Twig</li>
                                    </ul>
                                </div>
                            </div>
                        <div className=" my-5">
                            <div className="my-4 md:text-4xl text-xl md:ml-8 md:mt-10 ml-5">
                                .DBB()
                            </div>

                            <div>
                                <ul className="title md:text-xl text-sm md:ml-20 ml-12">
                                    <li className="item"> <span></span>MySQL </li>
                                </ul>
                            </div>
                        </div>

                        <div className=" my-5">
                            <div className="my-4 md:text-4xl text-xl md:ml-8 md:mt-10 ml-5" id="design">
                                .UI() & UX()
                            </div>

                            <div>
                                <ul className="title md:text-xl text-sm md:ml-20 ml-12">
                                    <li className="item"> <span></span>Figma</li>
                                    <li className="item"> <span></span>Adobe LightRoom</li>
                                </ul>
                            </div>
                        </div>

                        <div className=" my-5">
                            <div className="my-4 md:text-4xl text-xl md:ml-8 md:mt-10 ml-5">
                                .Gear()
                            </div>

                            <div>
                                <ul className="title md:text-xl text-sm md:ml-20 ml-12 w-50">
                                    <li className="item"> <span></span>Git & GitHub</li>
                                    <li className="item"> <span></span>Composer</li>
                                    <li className="item"> <span></span>Npm & Yarn</li>
                                </ul>
                            </div>
                        </div>
                    </div>
            </div>
        </section>
    </div>
    );
};

export default Xperience;
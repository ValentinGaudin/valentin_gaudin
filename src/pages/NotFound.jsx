import React from 'react';

const NotFound = () => {
    return (
        <div className="notFound">
            <div class="container flex flex-col items-center ">
            <img src="https://img.icons8.com/ios/250/000000/road-closure--v2.png" width="180" className="img content-center"/> 

                    <h2 className="h2 text-3xl my-10 tracking-widest">404</h2>
                    <h3 className="h1 text-5xl tracking-widest">Page not found.</h3>
                <p className="text text-1xl my-5">We’re sorry but it appears that we can’t find the page you were looking for. Usually this occurs because of a page that previously existed was removed or you’ve mistyped the address.</p>

            </div>
        </div>
    );
};

export default NotFound;
import Image from 'next/image';
const Insta = '/assets/icon/instagram.svg';
const Git = '/assets/icon/github.svg';
const Linkedin = '/assets/icon/linkedin.svg';

function Social() {
    return (
        <div className="my-10 text-sm md:text-xl">
            <figure>
                <a href="https://github.com/ValentinGaudin" target="_blank" rel="noreferrer">
                    <div className="relative left-10  mt-2 flex">
                        <Image src={Git} alt="Logo Github" width="40" height="40" className="social Git" />
                        <p className="mt-2 ml-5">GitHub</p>
                    </div>
                </a>
            </figure>
            <figure>
                <a href="https://www.linkedin.com/in/gaudinvalentin/" target="_blank" rel="noreferrer">
                    <div className="relative left-10  mt-2 flex">
                        <Image src={Linkedin} alt="Logo Instagram" width="40" height="40" className="social Linkedin" />
                        <p className="mt-2 ml-5">Linkedin</p>
                    </div>
                </a>
            </figure>
            <figure>
                <a href="https://www.instagram.com/valentin_gdn_/" target="_blank" rel="noreferrer">
                    <div className="relative left-10  mt-2 flex">
                        <Image src={Insta} alt="Logo Instagram" width="40" height="40" className="social Instagram" />
                        <p className="mt-2 ml-5">Instagram</p>
                    </div>
                </a>
            </figure>
        </div>
    );
}

export default Social;
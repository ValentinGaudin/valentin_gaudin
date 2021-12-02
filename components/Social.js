import Image from 'next/image';
import Insta from '../public/assets/icon/instagram.svg';
import Git from '../public/assets/icon/github.svg';
import Linkedin from '../public/assets/icon/linkedin.svg';

function Social() {
    return (
        <div className="social my-10 w-10 h-14 text-sm md:text-xl">
            <figure>
                <a href="https://github.com/ValentinGaudin" target="_blank" rel="noreferrer">
                    <div className="relative mt-2 flex">

                        <Image src={ Git } alt="Logo Github" className="git" />

                        <p className="mt-2">GitHub</p>
                    </div>
                </a>
            </figure>
            <figure>
                <a href="https://www.linkedin.com/in/gaudinvalentin/" target="_blank" rel="noreferrer">
                    <div className="relative mt-2 flex">

                        <Image src={ Linkedin } alt="Logo Linkedin" className="linkedin" />
                        <p className="mt-2">LinkedIn</p>
                    </div>
                </a>
            </figure>
            <figure>
                <a href="https://www.instagram.com/valentin_gdn_/" target="_blank" rel="noreferrer">
                    <div className="relative mt-2 flex">
                        <Image src={ Insta } alt="Logo Instagram" className="Instagram" />
                        <p className="mt-2">Instagram</p>
                    </div>
                </a>
            </figure>
        </div>
    );
}

export default Social;
import AllRight from './AllRight';
import Social from './Social';

export default function Footer() {
    return (
        <div>
            <div className="footer bottom-0 left-0 p-3 mt-4">
                <Social />
            </div>
            <div className="bottom-0 flex justify-center">
                <AllRight />
            </div>
        </div>
    );
};

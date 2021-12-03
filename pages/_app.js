import style from '../public/assets/styles/globals.scss';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp

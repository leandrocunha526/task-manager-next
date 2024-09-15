// pages/_app.tsx
import GlobalStyles from '@/app/global/GlobalStyles';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <GlobalStyles />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;

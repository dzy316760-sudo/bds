import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>ThuêNhàVN</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;

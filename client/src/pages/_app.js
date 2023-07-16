import '@/styles/globals.css'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import Script from 'next/script'

const defaultSEO = {
  title: 'engblogs',
  description:
    'learn from your favorite tech companies',
  openGraph: {
    type: 'website',
    url: 'https://www.engblogs.dev',
    site_name: 'engblogs',
    images: [
      {
        url: 'https://www.engblogs.dev/static/thumbnail.png',
        alt: 'engblogs.dev homepage',
      },
    ],
  },
};

export default function App({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...defaultSEO} />
      <Component {...pageProps} />

      <Head>
        <title>engblogs</title>
        <link rel="icon" href="/static/favicon.png" />
      </Head>
 
    </>
  );
}
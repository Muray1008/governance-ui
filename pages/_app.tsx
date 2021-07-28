import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import '../styles/index.css'
import useWallet from '../hooks/useWallet'

function App({ Component, pageProps }) {
  useWallet()

  const title = 'Mango Markets'
  const description =
    'Claim your stake in the Mango DAO. Join us in building Mango, the protocol for permissionless leverage trading & lending.'
  const keywords =
    'Mango Markets, Serum, SRM, Serum DEX, DEFI, Decentralized Finance, Decentralised Finance, Crypto, ERC20, Ethereum, Decentralize, Solana, SOL, SPL, Cross-Chain, Trading, Fastest, Fast, SerumBTC, SerumUSD, SRM Tokens, SPL Tokens'

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=PT+Mono&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@mangomarkets" />
        <meta name="twitter:title" content="Mango Markets" />
        <meta name="twitter:description" content={description} />

        {/* <link rel="manifest" href="/manifest.json"></link> */}
      </Head>
      <ThemeProvider defaultTheme="Mango">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default App

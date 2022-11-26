import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr';
import { lightTheme } from '../themes';
import '../styles/globals.css'
import { CartProvider, UIProvider } from '../context';
import { AuthProvider } from '../context/auth/AuthProvider';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider >
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
        <SWRConfig 
          value={{
            // refreshInterval: 500,
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >   
          <AuthProvider isLoggedIn={false}>
            <CartProvider isCartLoaded={false} cart={[]} numberOfItems={0} subTotal={0} tax={0} total={0}>
              <UIProvider isMenuOpen={false}>
                <ThemeProvider theme={ lightTheme } >
                  <CssBaseline />
                  <Component {...pageProps}/>
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>                  
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>        
  ) 
}

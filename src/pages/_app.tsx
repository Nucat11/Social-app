import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
import { AuthProvider } from "../components/AuthContext/AuthContext";
import "../styles/styles.css";
import { Navbar } from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
type User = FirebaseUser | null;

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    } else if (user) {
      return;
    } else if (error) {
      router.push("/");
    } else {
      router.push("/");
    }
  }, [user, loading]);

  return (
    <CacheProvider value={emotionCache}>
      <AuthProvider>
        <Head>
          <title>Social app</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </CacheProvider>
  );
}

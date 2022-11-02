import type { AppProps } from "next/app";
import SessionProvider from "@/context/session";
import "@/styles/global.css";
import { MantineProvider } from "@mantine/core";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
        fontFamily:
          "YuGothic, ヒラギノ角ゴ ProN W3, Lucida Grande, Hiragino Kaku Gothic ProN, メイリオ, Meiryo, Verdana, ＭＳ Ｐゴシック, sans-serif",
      }}
    >
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  );
}

export default MyApp;

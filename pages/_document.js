import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html land="en">
        <Head>
          <link
            rek="preload"
            href="/fonts/PlaypenSans-Bold.ttf"
            as="font"
            crossOrigin="anonymoys"
          ></link>
          <link
            rek="preload"
            href="/fonts/PlaypenSans-Regular.ttf"
            as="font"
            crossOrigin="anonymoys"
          ></link>
          <link
            rek="preload"
            href="/fonts/PlaypenSans-SemiBold.ttf"
            as="font"
            crossOrigin="anonymoys"
          ></link>
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { MetaProvider } from "@solidjs/meta";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* configure background color for dark color scheme */}
          <meta name="theme-color" content="#0d0d0d" />
          {/* configure apple mobile app status bar */}
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
            rel="stylesheet"
          />
          {assets}
        </head>
        <body>
          <MetaProvider>
            <div id="app">{children}</div>
          </MetaProvider>
          {scripts}
        </body>
      </html>
    )}
  />
));

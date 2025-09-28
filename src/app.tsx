import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";
import { inject } from "@vercel/analytics";

export default function App() {
  inject();

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <main>
            <Title>buildings</Title> <Suspense>{props.children}</Suspense>
          </main>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

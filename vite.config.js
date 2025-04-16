// import { defineConfig } from "vite";
// import { vitePlugin as remix } from "@remix-run/dev";
// import tsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig({
//   plugins: [
//     remix(), // No need for advanced v3 flags unless you need them
//     tsconfigPaths(), // Optional: handles `@/` path aliases from tsconfig
//   ],
// });


import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConvention: true,
      },
    }),
    tsconfigPaths(),
  ],
});

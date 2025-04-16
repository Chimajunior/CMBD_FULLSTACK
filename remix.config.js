/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "build/index.js",
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  postcss: true,
  future: {
    v2_meta: true,
    v2_headers: true,
    v2_errorBoundary: true,
    v2_routeConvention: true,
    v3_relativeSplatPath: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true,
    v3_lazyRouteDiscovery: true,

  }
};


// /** @type {import('@remix-run/dev').AppConfig} */
// export default {
//   appDirectory: "app",
//   assetsBuildDirectory: "public/build",
//   publicPath: "/build/",
//   serverBuildTarget: "vercel",
//   ignoredRouteFiles: ["**/.*"],
// };

// /** @type {import('@remix-run/dev').AppConfig} */
// export default {
//   appDirectory: "app",
//   assetsBuildDirectory: "public/build",
//   publicPath: "/build/",
//   serverBuildTarget: "vercel",
//   ignoredRouteFiles: ["**/.*"],
//   future: {
//     v2_routeConvention: true,
//   },
// };

// /** @type {import('@remix-run/dev').AppConfig} */
// export default {
//   future: {
//     v2_routeConvention: true,
//   },
//   ignoredRouteFiles: ["**/.*"],

//   appDirectory: "app",
//   assetsBuildDirectory: "public/build",
//   publicPath: "/build/",

//   serverBuildDirectory: "api/build",
//   serverModuleFormat: "esm",
// };

// /** @type {import('@remix-run/dev').AppConfig} */
// export default {
//   appDirectory: "app",
//   assetsBuildDirectory: "public/build",
//   publicPath: "/build/",
//   serverModuleFormat: "esm",
//   tailwind: true,
//   postcss: true,
//   ignoredRouteFiles: ["**/.*"],
//   future: {
//     v3_relativeSplatPath: true,
//     v3_throwAbortReason: true,
//   },
// };

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";


import stylesheet from './tailwind.css';
import TokenHandler from "./components/TokenHandler";
import ErrorPage from "./components/errors/ErrorPage";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader() {
  return json({
    ENV: {
      VITE_API_URL: process.env.VITE_API_URL,
    },
  });
}


export function links() {
  return [{ rel: 'stylesheet', href: stylesheet }];
}

export function Layout({ children }) {
  const data = useLoaderData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#121212] text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
      </body>
    </html>
  );
}


export default function App() {
  return (
    <>
      <TokenHandler />
      <Outlet />
    </>
  );
}

// Global Error Handler
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const status = error.status;
    const message = error.statusText || "Something went wrong.";

    if (status === 403) {
      return (
        <ErrorPage
          code={403}
          title="Forbidden"
          message="You don't have permission to access this page."
        />
      );
    }

    if (status === 404) {
      return (
        <ErrorPage
          code={404}
          title="Page Not Found"
          message="The page you're looking for doesn't exist."
        />
      );
    }

    return (
      <ErrorPage
        code={status}
        title={message}
        message="Something went wrong. Please try again later."
      />
    );
  }

  // Catch-all for unexpected runtime errors
  return (
    <ErrorPage
      code={500}
      title="Internal Server Error"
      message={error?.message || "Something unexpected happened on our end."}
    />
  );
}

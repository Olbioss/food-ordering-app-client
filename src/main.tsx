import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
// Fonts self-hosted via Fontsource (latin + latin-ext for Turkish glyphs).
// Body: Plus Jakarta Sans
import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-ext-400.css";
import "@fontsource/plus-jakarta-sans/latin-ext-500.css";
import "@fontsource/plus-jakarta-sans/latin-ext-600.css";
import "@fontsource/plus-jakarta-sans/latin-ext-700.css";
// Headings: Fraunces (display serif)
import "@fontsource/fraunces/latin-500.css";
import "@fontsource/fraunces/latin-600.css";
import "@fontsource/fraunces/latin-700.css";
import "@fontsource/fraunces/latin-ext-500.css";
import "@fontsource/fraunces/latin-ext-600.css";
import "@fontsource/fraunces/latin-ext-700.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Auth0ProviderWithNavigate>
          <AppRoutes />
          <Toaster richColors visibleToasts={1} position="top-right" />
        </Auth0ProviderWithNavigate>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);

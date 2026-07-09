import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
// Fonts self-hosted via Fontsource (latin + latin-ext for Turkish glyphs).
// Body: Nunito Sans
import "@fontsource/nunito-sans/latin-400.css";
import "@fontsource/nunito-sans/latin-600.css";
import "@fontsource/nunito-sans/latin-700.css";
import "@fontsource/nunito-sans/latin-800.css";
import "@fontsource/nunito-sans/latin-ext-400.css";
import "@fontsource/nunito-sans/latin-ext-600.css";
import "@fontsource/nunito-sans/latin-ext-700.css";
import "@fontsource/nunito-sans/latin-ext-800.css";
// Headings: Baloo 2 (rounded display)
import "@fontsource/baloo-2/latin-600.css";
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/latin-ext-600.css";
import "@fontsource/baloo-2/latin-ext-700.css";
import "@fontsource/baloo-2/latin-ext-800.css";
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

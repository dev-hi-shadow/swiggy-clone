import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/QueryClient.ts";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </QueryClientProvider>
);

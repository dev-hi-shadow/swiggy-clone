import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
  import { ToastProvider } from "./utils/useToastify.tsx";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./services/store.ts";
import { Provider } from "react-redux";


createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <ToastProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ToastProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);

import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import GlobalLoader from "./components/GlobalLoader";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Suspense fallback={<GlobalLoader />}>
            <App />
            <Toaster />
        </Suspense>
    </StrictMode>
);

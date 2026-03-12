import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router.jsx/Router";
import AuthProviders from "./Providers/AuthProviders";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProviders>
     <QueryClientProvider client={queryClient}>
       <div className="bg-white text-black">
        <RouterProvider router={router} />

        {/* ✅ Toast Container (ONE TIME ONLY) */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </div>
     </QueryClientProvider>
    </AuthProviders>
  </StrictMode>
);

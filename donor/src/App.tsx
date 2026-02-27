import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { store } from "./store";
import { Toaster } from "./components/ui/toaster";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import DonationForm from "./pages/DonationForm";
import DonationHistory from "./pages/DonationHistory";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

// Styles
import "./App.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Donor Only */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donate"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <DonationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <DonationHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </BrowserRouter>
    </Provider>
  );
};

export default App;

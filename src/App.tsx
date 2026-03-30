import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./api/client";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./utils/protectedRoute";
import { LoginPage } from "./components/Auth/LoginPage";
import { MainLayout } from "./components/Layout/MainLayout";
import "./App.css";

function App() {
  const basename = process.env.NODE_ENV === "production" ? "/auth-graphql" : "/";

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-8">Carregando...</div>;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}

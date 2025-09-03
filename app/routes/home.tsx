import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function meta() {
  return [
    { title: "PixelForge Studio Admin" },
    { name: "description", content: "PixelForge Studio Admin Panel" },
  ];
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect based on authentication status
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

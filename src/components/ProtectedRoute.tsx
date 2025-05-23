
import { useAuth } from "./AuthProvider";
import { AuthModal } from "./AuthModal";
import { useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Shopping Assistant</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard</p>
          <button 
            onClick={() => setShowAuth(true)}
            className="bg-shopping-blue hover:bg-shopping-blue-dark text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </button>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

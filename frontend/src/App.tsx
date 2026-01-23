import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { useAuthStore } from '@/stores/authStore';

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="presets"
            element={
              <ProtectedRoute>
                <div className="text-center py-8">
                  <h1 className="text-2xl font-bold">Presets Page</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="business-hours"
            element={
              <ProtectedRoute>
                <div className="text-center py-8">
                  <h1 className="text-2xl font-bold">Business Hours Page</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

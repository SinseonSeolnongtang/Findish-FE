import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainPage from '@/pages/MainPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import NormalModePage from '@/pages/NormalModePage';
import ComparePage from '@/pages/ComparePage';
import AIPickPage from '@/pages/AIPickPage';
import CartPage from '@/pages/CartPage';
import MyPage from '@/pages/MyPage';
import MapTestPage from '@/pages/MapTestPage';
import StorePage from '@/pages/StorePage';
import AuthLayout from '@/layout/AuthLayout';
import PrivateRoute from '@/components/common/PrivateRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 (개별 쿼리에서 override 가능)
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route path="/normal" element={<NormalModePage />} />
          <Route path="/pick" element={<Navigate to="/normal" replace />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/store/:id" element={<StorePage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/ai-pick" element={<AIPickPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
          <Route path="/about" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

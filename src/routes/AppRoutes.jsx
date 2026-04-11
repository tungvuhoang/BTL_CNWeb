import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import HostLayout from '../layouts/HostLayout';
import PlayerLayout from '../layouts/PlayerLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HostQuizzesPage from '../pages/host/HostQuizzesPage';
import HostQuizDetailPage from '../pages/host/HostQuizDetailPage';
import HostRoomPage from '../pages/host/HostRoomPage';
import PlayJoinPage from '../pages/player/PlayJoinPage';
import PlayRoomPage from '../pages/player/PlayRoomPage';
import NotFoundPage from '../pages/system/NotFoundPage';

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <HostLayout />
        </ProtectedRoute>
      }
    >
      <Route path={ROUTES.HOST_QUIZZES} element={<HostQuizzesPage />} />
      <Route path={ROUTES.HOST_QUIZ_DETAIL} element={<HostQuizDetailPage />} />
      <Route path={ROUTES.HOST_ROOM} element={<HostRoomPage />} />
    </Route>

    <Route element={<PlayerLayout />}>
      <Route path={ROUTES.PLAY} element={<PlayJoinPage />} />
      <Route path={ROUTES.PLAY_ROOM} element={<PlayRoomPage />} />
    </Route>

    <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
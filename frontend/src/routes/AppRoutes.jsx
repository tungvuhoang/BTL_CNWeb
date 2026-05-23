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
import HostPlaceholderPage from '../pages/host/HostPlaceholderPage';
import PlayJoinPage from '../pages/player/PlayJoinPage';
import PlayRoomPage from '../pages/player/PlayRoomPage';
import NotFoundPage from '../pages/system/NotFoundPage';
import LandingPage from '../pages/LandingPage';
import ChangePasswordPage from '../pages/host/ChangePasswordPage';
import ProfilePage from '../pages/host/ProfilePage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import PublicQuizSearchPage from '../pages/PublicQuizSearchPage';
import PublicQuizDetailPage from '../pages/PublicQuizDetailPage';
import HostPlayJoinPage from '../pages/host/HostPlayJoinPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
    <Route path={ROUTES.PUBLIC_QUIZZES} element={<PublicQuizSearchPage />} />
    <Route path={ROUTES.PUBLIC_QUIZ_DETAIL} element={<PublicQuizDetailPage />} />
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
      <Route path={ROUTES.HOST_PLAY} element={<HostPlayJoinPage />} />
      <Route path={ROUTES.HOST_PROFILE} element={<ProfilePage />} />
      <Route path={ROUTES.HOST_CHANGE_PASSWORD} element={<ChangePasswordPage />} />
      <Route path={ROUTES.HOST_QUIZZES} element={<HostQuizzesPage />} />
      <Route path={ROUTES.HOST_REPORTS} element={<HostPlaceholderPage title="Báo cáo" />} />
      <Route path={ROUTES.HOST_SETTINGS} element={<HostPlaceholderPage title="Cài đặt" />} />
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
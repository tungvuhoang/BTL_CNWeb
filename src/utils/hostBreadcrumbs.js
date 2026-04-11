import { ROUTES } from './constants';

/**
 * Breadcrumbs for host area — dùng pathname thay cho useMatches vì BrowserRouter
 * không có Data Router (useMatches sẽ throw trong react-router v7).
 */
export function getHostBreadcrumbs(pathname) {
  if (!pathname.startsWith('/host')) return [];

  if (pathname === ROUTES.HOST_QUIZZES) {
    return [
      { to: ROUTES.HOST_QUIZZES, label: 'Host' },
      { label: 'Quiz của tôi' },
    ];
  }

  if (/^\/host\/quizzes\/[^/]+$/.test(pathname)) {
    return [
      { to: ROUTES.HOST_QUIZZES, label: 'Host' },
      { label: 'Chi tiết quiz' },
    ];
  }

  if (/^\/host\/rooms\/[^/]+$/.test(pathname)) {
    return [
      { to: ROUTES.HOST_QUIZZES, label: 'Host' },
      { label: 'Phòng chơi' },
    ];
  }

  return [{ to: ROUTES.HOST_QUIZZES, label: 'Host' }];
}

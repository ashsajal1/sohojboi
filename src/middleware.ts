import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/question/create(.*)',
  '/article/create(.*)',
  '/question/edit/(.*)',
  '/article/edit/(.*)',
  '/dashboard',
  '/challenge',
  '/notifications',
  '/account',
  '/referral',
]);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
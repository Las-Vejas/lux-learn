import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/learn(.*)", "/lesson(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isProtectedRoute(request)) return;

  await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)", "/__clerk/:path*"],
};

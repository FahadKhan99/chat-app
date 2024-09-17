import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect unauthenticated users to the home page
  },
});

export const config = {
  matcher: ["/users/:path*", "/conversations/:path*"], // Protect these routes
};

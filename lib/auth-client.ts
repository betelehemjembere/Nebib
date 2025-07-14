import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined" && window.location.hostname !== "localhost"
      ? "https://nebib-forms-production.up.railway.app"
      : "http://localhost:3000", // the base url of your auth server
});
// .env.local

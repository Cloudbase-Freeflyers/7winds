import {
  getAdminOAuthConfigIssue,
  isAdminOAuthEnabled,
} from "@/lib/admin-oauth";
import AdminLoginClient from "./LoginForm";

export const metadata = {
  title: "כניסת ניהול",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <AdminLoginClient
      oauthEnabled={isAdminOAuthEnabled()}
      oauthIssue={getAdminOAuthConfigIssue()}
    />
  );
}

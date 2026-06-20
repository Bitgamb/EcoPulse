import { AuthForm } from "@/components/forms/auth-form";
import { AuthShell } from "@/components/layout/auth-shell";
export default function Login() {
  return (
    <AuthShell title="Welcome back" copy="Pick up where your greener habits left off.">
      <AuthForm mode="login" />
    </AuthShell>
  );
}

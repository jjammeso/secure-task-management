import { LoginForm } from "@/components/auth/LoginForm";
import { AuthProvider } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Home() {
  return (<>
    <AuthProvider>
      <h1>Home</h1>
      <LoginForm />
    </AuthProvider>

  </>
  );
}

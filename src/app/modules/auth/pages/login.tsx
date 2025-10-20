import { LoginBackground, LoginBranding, LoginForm } from '../components';

export default function LoginPage() {
  return (
    <LoginBackground>
      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <LoginBranding />
        <LoginForm />
      </div>
    </LoginBackground>
  );
}

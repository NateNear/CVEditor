import AuthForm from '@/components/AuthForm'

export const metadata = {
  title: 'Sign In - Resume Editor',
  description: 'Sign in to your resume editor account',
}

export default function SignInPage() {
  return <AuthForm mode="signin" />
}

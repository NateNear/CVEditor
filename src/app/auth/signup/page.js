import AuthForm from '@/components/AuthForm'

export const metadata = {
  title: 'Sign Up - Resume Editor',
  description: 'Create your resume editor account',
}

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}

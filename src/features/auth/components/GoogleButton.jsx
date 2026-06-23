import Button from '../../../components/ui/Button/index.js';

// Triggers Supabase Google OAuth. Handler wired in the auth section:
//   supabase.auth.signInWithOAuth({ provider: 'google',
//     options: { redirectTo: `${origin}/auth/callback` } })
export default function GoogleButton() {
  return (
    <Button variant="secondary" fullWidth>
      Sign in with Google
    </Button>
  );
}

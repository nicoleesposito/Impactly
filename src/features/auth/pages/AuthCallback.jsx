import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase.js';
import { ROUTES } from '../../../constants/routes.js';

// Handles Supabase redirect callbacks:
//  - Email confirmation after signup (type=signup)
//  - Magic-link / invite acceptance  (type=invite or type=magiclink)
//  - Password reset                  (type=recovery)
//
// If the user signed up with email confirmation enabled, their pending org
// data was saved to sessionStorage. We create the org here after the session
// is established.
export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Signing you in…');

  useEffect(() => {
    let done = false;

    async function finish(session) {
      if (done) return;
      done = true;

      if (!session) {
        navigate(ROUTES.signIn, { replace: true });
        return;
      }

      // Check for pending org data left by Step6Confirmation when email
      // confirmation was required.
      const raw = sessionStorage.getItem('impactly-pending-org');
      if (raw) {
        try {
          setStatus('Creating your organisation…');
          const pending = JSON.parse(raw);

          const { data: orgId, error: orgError } = await supabase.rpc('create_organisation', {
            p_name: pending.name,
            p_type: pending.type || null,
            p_country: pending.country || null,
            p_size: pending.size || null,
            p_beneficiary_label: pending.beneficiaryLabel || 'Students',
          });

          if (!orgError && orgId) {
            const promises = [];

            if (pending.beneficiaries?.length > 0) {
              promises.push(
                supabase.from('beneficiaries').insert(
                  pending.beneficiaries.map((b) => ({
                    org_id: orgId,
                    first_name: b.firstName ?? b.name ?? 'Unknown',
                    last_name: b.lastName ?? null,
                    date_of_birth: b.dob ?? null,
                    gender: b.gender ?? null,
                  })),
                ),
              );
            }

            if (pending.team?.length > 0) {
              promises.push(
                supabase.from('staff_invites').insert(
                  pending.team.map((m) => ({
                    org_id: orgId,
                    email: m.email,
                    access_level: m.accessLevel ?? 'Staff',
                    role: m.role ?? null,
                  })),
                ),
              );
            }

            await Promise.all(promises);
          }
        } catch {
          // Non-fatal: org creation failed; user can set up from settings
        } finally {
          sessionStorage.removeItem('impactly-pending-org');
        }
      }

      navigate(ROUTES.home, { replace: true });
    }

    // Supabase processes the URL fragment (#access_token=...) automatically.
    // Listen for the resulting auth state change.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        finish(session);
      }
    });

    // Also handle the case where the session is already active on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish(data.session);
    });

    return () => sub?.subscription?.unsubscribe();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      fontFamily: 'inherit',
      color: 'var(--color-text-muted, #888)',
      fontSize: '1rem',
    }}>
      {status}
    </div>
  );
}

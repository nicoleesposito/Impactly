import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { supabase } from '../../../lib/supabase.js';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './PersonalSettings.module.css';

function initials(first = '', last = '') {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || '?';
}

export default function PersonalSettings() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { org } = useOrg();

  const [form, setForm] = useState({
    firstName: profile?.first_name ?? user?.user_metadata?.first_name ?? '',
    lastName: profile?.last_name ?? user?.user_metadata?.last_name ?? '',
    email: user?.email ?? '',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
    setError('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const userId = user?.id;
      if (!userId) throw new Error('Not signed in');

      // Update profile row
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ first_name: form.firstName.trim(), last_name: form.lastName.trim() })
        .eq('id', userId);
      if (profileErr) throw profileErr;

      // Update auth email / password if changed
      const authUpdates = {};
      if (form.email.trim() && form.email.trim() !== user.email) {
        authUpdates.email = form.email.trim();
      }
      if (form.password) {
        authUpdates.password = form.password;
      }
      if (Object.keys(authUpdates).length > 0) {
        const { error: authErr } = await supabase.auth.updateUser(authUpdates);
        if (authErr) throw authErr;
      }

      await refreshProfile();
      setSaved(true);
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const displayInitials = initials(
    form.firstName || profile?.first_name,
    form.lastName || profile?.last_name,
  );

  const roleLine = [profile?.role, org?.name].filter(Boolean).join(' - ');
  const displayName = [form.firstName, form.lastName].filter(Boolean).join(' ') || user?.email;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Personal settings</h1>
      </header>

      <div className={styles.card}>
        {/* Profile identity bar */}
        <div className={styles.identityRow}>
          <span className={styles.avatar} aria-hidden="true">{displayInitials}</span>
          <div className={styles.identityText}>
            <span className={styles.identityName}>{displayName}</span>
            {roleLine && <span className={styles.identityRole}>{roleLine}</span>}
          </div>
          <button type="button" className={styles.changePhotoBtn}>Change photo</button>
        </div>

        <hr className={styles.divider} />

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>First name</span>
            <input
              className={styles.input}
              value={form.firstName}
              onChange={update('firstName')}
              placeholder="First name"
              autoComplete="given-name"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Last name</span>
            <input
              className={styles.input}
              value={form.lastName}
              onChange={update('lastName')}
              placeholder="Last name"
              autoComplete="family-name"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Email</span>
            <input
              type="email"
              className={styles.input}
              value={form.email}
              onChange={update('email')}
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Password</span>
            <input
              type="password"
              className={styles.input}
              value={form.password}
              onChange={update('password')}
              placeholder="New password (leave blank to keep current)"
              autoComplete="new-password"
            />
          </label>

          {error && <p className={styles.error} role="alert">{error}</p>}
          {saved && <p className={styles.savedNote} role="status">Changes saved.</p>}

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

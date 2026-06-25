import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';
import { ChevronLeft, Close } from '../../../components/icons.jsx';
import styles from './InviteStaff.module.css';

// Invite page (PDF p.14).
// Lets the admin pick an access level, enter an email and optional role title,
// and queue invite(s). Each queued entry appears in "Invited members" below the
// form, and in the Pending invites stat on the Staff list (p.39).
// The actual email is sent via a Supabase Edge Function once the user taps Send.

const ACCESS_LEVELS = [
  { id: 'admin',   label: 'Admin – Full access' },
  { id: 'manager', label: 'Manager – programmes & reports' },
  { id: 'staff',   label: 'Staff – attendance only' },
];

const ROLE_OPTIONS = [
  'Programme manager',
  'Social worker',
  'Teacher',
  'Volunteer coordinator',
  'Finance officer',
  'Other',
];

export default function InviteStaff() {
  const navigate = useNavigate();
  const { pendingInvites, addInvite, removeInvite } = useStaff();

  const [accessLevel, setAccessLevel] = useState('staff');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (pendingInvites.some((i) => i.email === email.trim().toLowerCase())) {
      setEmailError('This email has already been invited.');
      return;
    }
    setEmailError('');
    await addInvite({ email, accessLevel, role });
    setEmail('');
    setRole('');
  }

  async function handleSend() {
    if (pendingInvites.length === 0) return;
    setSending(true);
    // Supabase Edge Function sends the actual invite email and writes to
    // pending_invites table. The invitee receives a sign-up link; once they
    // accept and create their account, a Supabase trigger moves them from
    // pending_invites to the staff table.
    // TODO(staff): uncomment once Edge Function invite-staff is deployed.
    // await supabase.functions.invoke('invite-staff', { body: { invites: pendingInvites } });
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    setSending(false);
    setSent(true);
    setTimeout(() => navigate(-1), 1200);
  }

  function initials(emailStr = '') {
    return emailStr[0]?.toUpperCase() ?? '?';
  }

  const accessLabel = ACCESS_LEVELS.find((a) => a.id === accessLevel)?.label ?? '';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Invite</h1>
      </header>

      {/* Access level pills */}
      <div className={styles.pills} role="group" aria-label="Access level">
        {ACCESS_LEVELS.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={accessLevel === a.id}
            className={`${styles.pill} ${accessLevel === a.id ? styles.pillActive : ''}`}
            onClick={() => setAccessLevel(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleAdd} noValidate>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="invite-email">Email</label>
          <input
            id="invite-email"
            type="email"
            className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            placeholder=""
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            autoComplete="email"
            inputMode="email"
          />
          {emailError && <p className={styles.fieldError}>{emailError}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="invite-role">Role</label>
          <div className={styles.selectWrap}>
            <select
              id="invite-role"
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" />
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.addRow}>
          <button
            type="submit"
            className={styles.addBtn}
            disabled={!email.trim()}
          >
            + Add
          </button>
        </div>
      </form>

      {/* Invited members list */}
      {pendingInvites.length > 0 && (
        <section className={styles.invited}>
          <h2 className={styles.invitedTitle}>Invited members</h2>
          <ul className={styles.inviteList}>
            {pendingInvites.map((inv) => (
              <li key={inv.id} className={styles.inviteRow}>
                <span className={styles.inviteAvatar} aria-hidden="true">
                  {initials(inv.email)}
                </span>
                <span className={styles.inviteText}>
                  <span className={styles.inviteEmail}>{inv.email}</span>
                  <span className={styles.inviteRole}>
                    {inv.role || ACCESS_LEVELS.find((a) => a.id === inv.accessLevel)?.label.split('–')[0].trim()}
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  aria-label={`Remove ${inv.email}`}
                  onClick={() => removeInvite(inv.id)}
                >
                  <Close size={16} />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={sending || sent}
          >
            {sent ? 'Invites sent!' : sending ? 'Sending…' : `Send ${pendingInvites.length} invite${pendingInvites.length !== 1 ? 's' : ''}`}
          </button>
        </section>
      )}
    </div>
  );
}

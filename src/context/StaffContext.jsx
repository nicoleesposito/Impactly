import { createContext, useContext, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';

// Staff & invites context (FR-012).
// pendingInvites: sent but not yet accepted. activeStaff: accepted + on roster.
// addInvite() saves to the pending_invites table and queues an email via Supabase
// Edge Function (invite-staff). The Edge Function calls
// supabase.auth.admin.inviteUserByEmail() server-side with the service-role key.
const StaffContext = createContext({
  activeStaff: [],
  pendingInvites: [],
  addInvite: async () => {},
  removeInvite: () => {},
});

export function StaffProvider({ children }) {
  const [activeStaff, setActiveStaff] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

  async function addInvite({ email, accessLevel, role }) {
    const invite = {
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      accessLevel,
      role: role || null,
      sentAt: new Date().toISOString(),
    };

    // Persist locally first so the UI is responsive.
    setPendingInvites((prev) => [...prev, invite]);

    // TODO(staff): persist to `pending_invites` table and trigger email via Edge Function.
    // await supabase.functions.invoke('invite-staff', { body: { email, accessLevel, role } });

    return invite;
  }

  function removeInvite(id) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== id));
    // TODO(staff): delete from `pending_invites` table.
  }

  const value = useMemo(
    () => ({ activeStaff, pendingInvites, addInvite, removeInvite }),
    [activeStaff, pendingInvites],
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  return useContext(StaffContext);
}

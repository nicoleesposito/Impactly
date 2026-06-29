import { createContext, useContext, useState } from 'react';

const NotificationsContext = createContext(null);

const SEED = [
  {
    id: '1',
    actorName: 'Taylor Hall',
    actorRole: 'Programme manager',
    actorProgramme: 'Literacy Youth',
    action: 'Added a new beneficiary (Student)',
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    actorName: 'Sipho Dlamini',
    actorRole: 'Staff',
    actorProgramme: 'Digital Skills',
    action: 'Marked attendance for 34 students',
    read: false,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    actorName: 'Amara Nkosi',
    actorRole: 'Admin',
    actorProgramme: 'ECD',
    action: 'Submitted grant report to Kagiso Trust',
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    actorName: 'Lerato Mokoena',
    actorRole: 'Volunteer',
    actorProgramme: 'Literacy Youth',
    action: 'Updated beneficiary profile for David Dlamii',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(SEED);

  function clearAll() {
    setNotifications([]);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, clearAll, markAllRead, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

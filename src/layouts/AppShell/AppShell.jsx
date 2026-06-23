import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import BottomNav from './BottomNav.jsx';
import ProgrammePills from '../../components/ProgrammePills/index.js';
import styles from './AppShell.module.css';

// Responsive shell: desktop sidebar ⇄ mobile bottom nav. The programme pill
// strip (FR-014) is persistent across every screen rendered in <Outlet/>.
export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <ProgrammePills />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

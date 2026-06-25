import { AuthProvider } from './AuthContext.jsx';
import { OrgProvider } from './OrgContext.jsx';
import { ProgrammeFilterProvider } from './ProgrammeFilterContext.jsx';
import { StaffProvider } from './StaffContext.jsx';
import { ThemeProvider } from './ThemeContext.jsx';

// Single wrapper composing all global providers, mounted once in main.jsx.
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrgProvider>
          <StaffProvider>
            <ProgrammeFilterProvider>{children}</ProgrammeFilterProvider>
          </StaffProvider>
        </OrgProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export { useAuth } from './AuthContext.jsx';
export { useOrg } from './OrgContext.jsx';
export { useProgrammeFilter } from './ProgrammeFilterContext.jsx';
export { useStaff } from './StaffContext.jsx';
export { useTheme } from './ThemeContext.jsx';

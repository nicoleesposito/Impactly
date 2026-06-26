import { AuthProvider } from './AuthContext.jsx';
import { OrgProvider } from './OrgContext.jsx';
import { ProgrammeFilterProvider } from './ProgrammeFilterContext.jsx';
import { StaffProvider } from './StaffContext.jsx';
import { FundersProvider } from './FundersContext.jsx';
import { ThemeProvider } from './ThemeContext.jsx';

// Single wrapper composing all global providers, mounted once in main.jsx.
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrgProvider>
          <StaffProvider>
            <FundersProvider>
              <ProgrammeFilterProvider>{children}</ProgrammeFilterProvider>
            </FundersProvider>
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
export { useFunders } from './FundersContext.jsx';
export { useTheme } from './ThemeContext.jsx';

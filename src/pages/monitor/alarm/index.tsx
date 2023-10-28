import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { MonitorLeftRender } from '../components/MonitorLeftRender';
import { SqlEditor } from '@/components/sqlEditor';

export default function Alarm({ children }) {
  return (
    <CsPage>
      <CsHeader leftRender={<MonitorLeftRender />}></CsHeader>
      <SqlEditor language="sql" options={{}} value={`CREATE TABLE dbo.EmployeePhoto1`} />

      <CsContent>{children}</CsContent>
    </CsPage>
  );
}

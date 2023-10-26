import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { MonitorLeftRender } from '../components/MonitorLeftRender';
export default function Alarm({ children }) {
  return (
    <CsPage>
      <CsHeader leftRender={<MonitorLeftRender />}></CsHeader>
      <CsContent>{children}</CsContent>
    </CsPage>
  );
}

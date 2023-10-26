import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { MonitorLeftRender } from '../components/MonitorLeftRender';

export default function Dashboard() {
  return (
    <CsPage>
      <CsHeader leftRender={<MonitorLeftRender />}></CsHeader>
      <CsContent>监控 </CsContent>
    </CsPage>
  );
}

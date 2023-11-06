import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { MonitorLeftRender } from '../components/MonitorLeftRender';
import { Button, Tabs } from 'antd';
import { useHistory } from 'react-router';

export default function Alarm({ children }) {
  const baseUrl = '/monitor/alarm';

  const history = useHistory();
  const lastPath = history.location.pathname;
  const urlchange = (name) => {
    history.push({
      pathname: `${name}`,
    });
  };

  return (
    <CsPage>
      <CsHeader
        leftRender={<MonitorLeftRender />}
        extraRender={
          <Button onClick={() => urlchange(`${baseUrl}/new`)} type="primary">
            + 告警策略
          </Button>
        }
      />
      <CsContent>
        <Tabs
          onChange={urlchange}
          activeKey={lastPath}
          items={[
            { label: '告警历史', key: `${baseUrl}/history` },
            { label: '告警策略', key: `${baseUrl}/tactics` },
          ]}
        />
        {children}
      </CsContent>
    </CsPage>
  );
}

import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import styles from './index.less';
import { Button } from 'antd';
import { useModel } from 'umi';
const List = [{ title: '连接信息', desc: '集群A' }];

const OperSection = ({ title, desc, oper = undefined }) => {
  return (
    <div className={styles.OperSection}>
      <div className={styles.left}>
        <div className={styles.OperSectionTitle}>{title}</div>
        <div className={styles.OperSectionDesc}>{desc}</div>
      </div>
      {oper && <div className={styles.right}>{oper}</div>}
    </div>
  );
};

export default function TableMgr() {
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  return (
    <CsPage>
      <CsHeader className={styles.header} leftRender={<div>集群设置</div>} />
      <CsContent>
        <OperSection title="连接信息" desc={clusterName} />
        <OperSection
          title="修改 root 密码"
          desc={
            '在这里修改当前集群的用户 root 的密码。登录 Doris Manager 时，你需要提供 root 账户。'
          }
          oper={<Button>修改密码</Button>}
        />
        <OperSection
          title="修改 admin 密码"
          desc={'修改当前集群的用户 admin 的密码。'}
          oper={<Button>修改密码</Button>}
        />
        <OperSection
          title="高危操作区"
          desc={'取消对此集群的管控，这不会影响你使用其他方式使用集群。'}
          oper={<Button danger>取消管控</Button>}
        />
      </CsContent>
    </CsPage>
  );
}

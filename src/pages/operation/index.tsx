import { useModel } from 'umi';
import styles from './index.less';

export default function Operation(props) {
  const [{ hiddenMsg, hiddenMsgOpen }] = useModel('clusterRestart');

  return (
    <section className={styles.operation}>
      {hiddenMsgOpen && (
        <div className={styles.notice}>
          {/* <Notice /> */}
          提示
        </div>
      )}
      <div className={styles.operationMain}>{props.children}</div>
    </section>
  );
}

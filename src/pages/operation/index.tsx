import styles from './index.less';

export default function Operation(props) {
  // const [menuList, setMenuList] = useState([]);
  // useMount(() => {
  //   const MenuData = getMenuData([props.route]);
  //   const { breadcrumbMap } = MenuData;
  //   const list = [];
  //   for (const [key, val] of breadcrumbMap) {
  //     if (key !== selfUrl) {
  //       list.push(val);
  //     }
  //   }
  //   setMenuList(list);
  // });

  return (
    <section className={styles.operation}>
      {/* <div className={styles.notice}>
        <Notice />
      </div> */}
      <div className={styles.operationMain}>{props.children}</div>
    </section>
  );
}

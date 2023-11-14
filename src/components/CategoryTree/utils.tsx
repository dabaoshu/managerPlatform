import type { DataNode } from 'antd/es/tree';
export const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

export const generateList = (
  data: DataNode[],
  dataList: { key: React.Key; title: string }[] = [],
) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({ key, title: title as string });
    if (node.children) {
      generateList(node.children, dataList);
    }
  }
  return dataList;
};

const checkIsValidlist = (list: any) => {
  return Array.isArray(list) && list.length > 0;
};
export function getTreeMap<T>(treeData: ITreeData<T>[]) {
  const nodePathMap: Map<string, NodePath<T>> = new Map();
  const loop = (data: ITreeData<T>[], path: string[]) => {
    data.forEach((item) => {
      const { children, key } = item;
      const newPath = [...path, key];
      const parentKey = path[path.length - 1];
      nodePathMap.set(key, { path: newPath, allChildKeys: [], _node: item, key, parentKey });
      if (checkIsValidlist(children)) {
        loop(children, newPath);
      }
    });
  };
  loop(treeData, []);
  nodePathMap.forEach((item, key) => {
    const { path } = item;
    const belongKeys = path.slice(0, path.length - 1);
    belongKeys.forEach((belongKey) => {
      const node = nodePathMap.get(belongKey);
      node.allChildKeys.push(key);
    });
  });
  return nodePathMap;
}

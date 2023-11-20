import { Tree, Input, Tooltip, Spin } from 'antd';
import type { TreeDataNode, TooltipProps } from 'antd';
import styles from './index.less';
import type { FC } from 'react';
import { useMemo, isValidElement, useRef, useLayoutEffect } from 'react';
import type { SearchProps } from 'antd/es/input';
import { getTreeMap } from './utils';
import { useMergedState } from 'rc-util';
import type { DirectoryTreeProps } from 'antd/es/tree';
import classnames from 'classnames';
import _ from 'lodash';
import { useDebounceFn } from 'ahooks';
const { DirectoryTree } = Tree;
type OptionSearchProps = Omit<SearchProps, 'onSearch'> & {
  /** 如果 onSearch 返回一个false，直接拦截请求 */
  onSearch?: (keyword: string) => Promise<boolean | undefined> | boolean | undefined;
  // 目录对节点title的搜索 默认是title
  searchKey?: string;
};

export type SearchPropType = OptionSearchProps | React.ReactNode | boolean;
export type TooltipPropType<T> =
  | (Omit<TooltipProps, 'title'> & {
      titleRender: (item: T, itemDom: React.ReactNode) => React.ReactNode;
    })
  | boolean;

export interface CategoryTreeProps<T extends object = TreeDataNode> extends DirectoryTreeProps<T> {
  loading?: boolean;
  /** 搜索输入栏相关配置 */
  search?: SearchPropType;
  /** 搜索输入栏背景 */
  placeholder?: string;
  /** 搜索回调 */
  onSearch?: (keyWords: string) => void;
  // 是否显示tooltip
  tooltip?: TooltipPropType<T>;
  // 记录ExpandedKeys的修改
  onExpandedKeysChange?: (keys: React.Key[]) => void;
}

export const CategoryTree: FC<CategoryTreeProps> = ({
  search,
  placeholder,
  onSearch,
  tooltip,
  loading,
  treeData: defaultData,
  expandedKeys: _expandedKeys,
  defaultExpandedKeys,
  titleRender: _titleRender,
  height: _height,
  onExpand: _onExpand,
  autoExpandParent: _autoExpandParent,
  onExpandedKeysChange,
  ...treeProps
}) => {
  const [expandedKeys, setExpandedKeys] = useMergedState<React.Key[]>([], {
    defaultValue: defaultExpandedKeys,
    value: _expandedKeys,
  });
  const [searchValue, setSearchValue] = useMergedState<string>('', {
    value: search && ((search as OptionSearchProps)?.value as string),
  });
  const [autoExpandParent, setAutoExpandParent] = useMergedState(true, {
    value: _autoExpandParent,
  });
  const [height, setHeight] = useMergedState(0, {
    value: _height,
  });
  const treeBoxRef = useRef();
  useLayoutEffect(() => {
    if (treeBoxRef.current && !_height) {
      setHeight(treeBoxRef.current.clientHeight);
    }
  }, []);

  const dataMap = useMemo(() => {
    return getTreeMap(defaultData);
  }, [defaultData]);

  const searchKey = (search as OptionSearchProps)?.searchKey || 'title';

  const { run: onChange } = useDebounceFn(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      let newExpandedKeys = [];
      if (!!value) {
        dataMap.forEach(({ _node: item, path }) => {
          if (item[searchKey].indexOf(value) > -1 && newExpandedKeys.length < 100) {
            newExpandedKeys.push(...path);
          }
        });
      }
      newExpandedKeys = _.uniq(newExpandedKeys);
      setExpandedKeys(newExpandedKeys);
      if (onExpandedKeysChange) onExpandedKeysChange(newExpandedKeys);
      setSearchValue(value);
      if ((search as OptionSearchProps)?.onChange) (search as OptionSearchProps)?.onChange(e);
      setAutoExpandParent(!!value);
    },
    { wait: 300 },
  );

  const onExpand = (newExpandedKeys: React.Key[], info) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
    if (_onExpand) _onExpand(newExpandedKeys, info);
    if (onExpandedKeysChange) onExpandedKeysChange(newExpandedKeys);
  };

  const SearchDom = useMemo(() => {
    if (!search) {
      return null;
    }
    if (isValidElement(search)) {
      return search;
    }
    return (
      <Input.Search
        placeholder={placeholder}
        {...(search as SearchProps)}
        onChange={onChange}
        onSearch={async (...restParams) => {
          const success = await (search as any).onSearch?.(...restParams);
          if (success !== false) {
            onSearch?.(restParams?.[0]);
          }
        }}
      />
    );
  }, [placeholder, onSearch, search, onChange]);

  const treeData = useMemo(() => {
    if (!SearchDom) {
      return defaultData;
    }
    const loop = (data: TreeDataNode[], list = []): TreeDataNode[] => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const strTitle = item[searchKey];
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        let keep = index > -1;
        let children;
        if (item.children) {
          children = loop(item.children);
          keep = children.length > 0;
        }
        if (keep) {
          list.push({ ...item, title, children });
        }
      }
      return list;
    };
    return loop(defaultData);
  }, [searchValue, defaultData, SearchDom, searchKey]);
  const titleRender = (item) => {
    const titleDom = _titleRender?.(item) || item.title;
    if (typeof tooltip === 'object') {
      const _title = tooltip?.titleRender(item, titleDom) || titleDom;
      return <Tooltip title={_title}>{titleDom}</Tooltip>;
    }
    return titleDom;
  };

  console.log('autoExpandParent', autoExpandParent);
  console.log('expandedKeys', expandedKeys);

  return (
    <div className={styles.CategoryTree}>
      {!!SearchDom && <div className={styles.searchBox}>{SearchDom}</div>}
      <div
        className={classnames(styles.treeWrap, { [styles.hasSearch]: !!SearchDom })}
        ref={treeBoxRef}
      >
        <Spin spinning={loading}>
          <DirectoryTree
            showIcon
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={false}
            treeData={treeData}
            height={height}
            blockNode
            titleRender={titleRender}
            {...treeProps}
          />
        </Spin>
      </div>
    </div>
  );
};

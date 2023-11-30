import {
  ProFormDigit,
  ProFormText,
  ProFormList,
  ProCard,
  ProForm,
  ProFormSelect,
  FormListContext,
} from '@ant-design/pro-components';
import styles from './index.less';
import React, { memo, useContext, useMemo } from 'react';
import { useIntl } from 'umi';
import { requiredRule } from '@/utils/form';
import classnames from 'classnames';
import { Button, Collapse, Form, Space, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
const belongParentListNode = (listName) => {
  return typeof listName === 'number';
};
const parseVisiable = (visiable) => {
  try {
    const [dependName, oper, val] = visiable.split(' ');
    console.log(visiable);
    return {
      dependName,
      oper,
      val,
    };
  } catch (error) {}
  return {};
};
// 就两种情况 一个true，false 一个同层级值的控制渲染
const useCatWith = (visiable: any) => {
  const form = Form.useFormInstance();
  const { listName } = useContext(FormListContext);
  const { dependName, oper, val } = parseVisiable(visiable);
  const namePath = listName ? [...listName, dependName] : [dependName];
  const dependVal = Form.useWatch(namePath, form);
  if (typeof visiable === 'string') {
    if (['true', 'false'].includes(visiable)) {
      return visiable === 'true';
    } else if (dependName && oper) {
      if (oper === '==') {
        return dependVal === val;
      } else if (oper === '!=') {
        return dependVal !== val;
      }
    }
  } else if (typeof visiable === 'boolean') {
    return visiable;
  }
  return true;
};

const useTransProps = (props) => {
  const {
    default: defaultValue,
    label: _label,
    name: _name,
    required,
    form_field_name,
    disable: _disable,
    ..._props
  } = props;
  const { locale } = useIntl();
  const isZh = locale === 'zh-CN';
  const { paramName, paramDesc } = useMemo(() => {
    return {
      paramName: isZh ? 'label_zh' : 'label_en',
      paramDesc: isZh ? 'description_zh' : 'description_en',
    };
  }, [isZh]);
  const label = _label || props[paramName];

  const rules = useMemo(() => {
    const r = [];
    if (required === 'true') {
      r.push(requiredRule);
    }
    return r;
  }, [required]);

  const disable = _disable || props.editable;

  const name = _name || form_field_name;

  const otherProps = useMemo(() => {
    let _obj = {};
    if (props.candidates) {
      _obj.options = props.candidates.map((o) => {
        return {
          value: o.value,
          label: o[isZh ? 'label_zh' : 'label_en'],
        };
      });
    }
    return _obj;
  }, [props.candidates, isZh]);

  const rest = {
    ..._props,
    disable,
    tooltip: props[paramDesc],
    name,
    rules,
    label: label,
    initialValue: defaultValue,
    ...otherProps,
  };
  return rest;
};

const ParameItem = memo((props) => {
  const { inputType = 'text', field_type } = props;

  const rest = useTransProps(props);
  const visiable2 = rest.name === 'name' ? 'type == local' : true;
  const visiable = useCatWith(visiable2);
  /**先走这三个结构类型 */
  if (field_type === 'object') {
    return <ParameItemObj {...rest} />;
  } else if (field_type === 'array-object') {
    return <ListParameItem {...rest} />;
  } else if (field_type === 'array-string') {
    return <ListStringParameItem {...rest} />;
  }
  if (visiable === false) {
    return null;
  }

  if (inputType === 'text') {
    return <ProFormText {...rest} />;
  } else if (inputType === 'number') {
    <ProFormDigit {...rest} />;
  } else if (inputType === 'password') {
    <ProFormText.Password {...rest} />;
  } else if (inputType === 'select') {
    <ProFormSelect {...rest} />;
  }
  // else if (inputType === 'array-string') {
  //   return <ListStringParameItem {...rest} />;
  // } else if (inputType === 'array-object') {
  //   return
  // } else if (inputType === 'object') {
  // }
  return <ProFormText {...rest} />;
});

const ListParameItem = memo((props) => {
  const { label, name, children, tooltip } = useTransProps(props);
  return (
    <ProCard
      type="inner"
      bordered
      tooltip={tooltip}
      size="small"
      title={label}
      collapsible
      className={classnames(styles.parameItem, styles.obj)}
    >
      <ProFormList
        name={name}
        initialValue={[]}
        copyIconProps={false}
        creatorButtonProps={{
          position: 'top',
          // creatorButtonText: '新建',
          // icon: false,
          // type: 'link',
          // style: { width: 'unset' },
        }}
        itemRender={({ listDom, action }, { index }) => (
          <ProCard
            type="inner"
            bordered
            size="small"
            title={`${label} (${index + 1})`}
            collapsible
            extra={action}
            className={classnames(styles.parameItem, styles.obj)}
          >
            <div className={styles.proCardContent}>{listDom}</div>
          </ProCard>
        )}
      >
        {children?.map((o) => {
          return <ParameItem key={o.field_name} name={o.field_name} {...o} />;
        })}
      </ProFormList>
    </ProCard>
  );
});

function ListStringParameItem(props) {
  const { label, name: orginName, rules } = useTransProps(props);
  const { name: listLastName } = useContext(FormListContext);

  const name = belongParentListNode(listLastName) ? [listLastName, orginName] : [orginName];
  return (
    <ProForm.Item isListField style={{ marginBlockEnd: 0 }} label={label}>
      <Form.List name={name} initialValue={[]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, idx) => (
              <Form.Item key={field.key}>
                <Space>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={rules}
                    noStyle
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                </Space>
              </Form.Item>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                新建
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </ProForm.Item>
  );
}

function ParameItemObj(props) {
  const { children } = props;

  const { label, name, tooltip } = useTransProps(props);
  // const borderColor = [''];

  // const borderColor = useMemo(() => {
  //   return name.length;
  // }, [name]);
  return (
    <ProCard
      type="inner"
      bordered
      tooltip={tooltip}
      size="small"
      title={label}
      collapsible
      className={classnames(styles.parameItem, styles.obj)}
    >
      <div className={styles.proCardContent}>
        {children.map((o) => (
          <ParameItem key={o.field_name} {...o} />
        ))}
      </div>
    </ProCard>
  );
}

export default function ParameTree({ ParamList }) {
  return (
    <div>
      {ParamList.map((item) => (
        <ParameItem key={item.field_name} {...item} />
      ))}
    </div>
  );
}

export type { ColumnsType } from 'antd/es/table';
export type { DropDownProps, AutoCompleteProps, PaginationProps, TableColumnsType } from 'antd';

/**
 * 导出pro-components默认部分
 */
// 不全局导出  export * from '@ant-design/pro-components';
export {
  ProTable, //
  ModalForm,
  DrawerForm,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormCaptcha,
  DefaultFooter,
  ProFormDatePicker
} from '@ant-design/pro-components';

export type {
  ProCoreActionType, //
  ProFormInstance,
} from '@ant-design/pro-components';

//目前这个还是用回老的
export type { ProColumns } from '@ant-design/pro-table';
export { PageContainer } from '@ant-design/pro-layout';


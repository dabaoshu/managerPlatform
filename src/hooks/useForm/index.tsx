import type { FormInstance } from 'antd/es/form/Form';
// 非hooks 可以在类组件中使用 主要是处理form 回调=> promise
// 校验规范 以后就是这种数据格式 [next,values]
export function getSubmit(form: Pick<FormInstance, 'validateFields'>) {
  const Submit = () =>
    new Promise<[boolean, any, any]>((resolve) => {
      form
        .validateFields()
        .then((values) => {
          resolve([true, values, null]);
        })
        .catch((errorInfo) => {
          resolve([false, null, errorInfo]);
        });
    });

  return Submit;
}

// export const useWatch = (fied, { form, preserve }) => {

// };

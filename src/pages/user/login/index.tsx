import { useRef, useState } from 'react';
import { Form, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import styles from './index.less';
import { useIntl } from 'umi';
import classNames from 'classnames';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login } from '@/services/login';
import { md5Encryption } from '@/utils/encrypt';
import { useMount, useRequest } from 'ahooks';
import loginServer from '@/module/login.server';
const initPage = '/operation';
function Login() {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const userName = 'admin';
  const redirectRef = useRef('');
  const { runAsync, loading } = useRequest(login, { manual: true });

  useMount(() => {
    loginServer.login({
      userName: 'temp',
      token: 'token',
    });
  });

  useMount(() => {
    const { query = {} } = history.location;
    const { redirect } = query;
    redirectRef.current = decodeURIComponent(redirect || initPage);
  });
  const onFinish = async (values) => {
    try {
      const { isSuccess, data } = await runAsync({
        ...values,
        password: md5Encryption(values.password),
      });
      if (!isSuccess) return;
      message.success(
        formatMessage({
          id: 'user.login.success',
          defaultMessage: '登录成功！',
        }),
      );
      const { token, username } = data;
      loginServer.login({
        userName: username,
        token: token,
      });
      history.push(redirectRef.current);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // 878CB1
  // 31395B
  return (
    <div className={classNames(styles.background, 'full-height', 'full-width')}>
      <div className={styles.header}>
        <img src="/logo.png" width={172} height={36} alt="" />
      </div>
      <div className={styles.content}>
        <div className={styles['login-form-wrap']}>
          <div className={styles['title']}>
            {formatMessage({
              id: 'user.login.welcometoLogin',
              defaultMessage: '欢迎登录',
            })}
          </div>
          <div className={styles['sub-title']}>
            {formatMessage(
              {
                id: 'user.login.welcometoRootLogin',
                defaultMessage: '请输入集群 {name} 用户的密码',
              },
              {
                name: userName,
              },
            )}
          </div>
          <ProForm
            submitter={{ render: false }}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={styles['login-form']}
            initialValues={{
              userName,
            }}
          >
            <ProFormText
              formItemProps={{
                className: styles['login-form-item'],
              }}
              name="userName"
              disabled
              fieldProps={{
                size: 'large',
                className: styles['login-form-item-input'],
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入您的帐号!',
                },
              ]}
            />
            <ProFormText.Password
              formItemProps={{
                className: styles['login-form-item'],
              }}
              name="password"
              fieldProps={{
                size: 'large',
                className: styles['login-form-item-input'],
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入您的密码!',
                },
              ]}
            />

            <Form.Item>
              <Button
                type="primary"
                className={styles['login-form-submit']}
                block
                htmlType="submit"
                size="large"
                loading={loading}
              >
                {formatMessage({
                  id: 'user.login.login',
                  defaultMessage: '登录',
                })}
              </Button>
            </Form.Item>
            <Button block type="link" className={styles['login-form-back']}>
              {formatMessage({
                id: 'user.login.back',
                defaultMessage: '返回',
              })}
            </Button>
          </ProForm>
        </div>
      </div>
    </div>
  );
}

export default Login;

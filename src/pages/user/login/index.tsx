import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useHistory } from 'react-router-dom';
import styles from './index.less';
import { useIntl } from 'umi';
import classNames from 'classnames';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
const login = () => {};
function Login() {
  const { formatMessage } = useIntl();
  const [username, setUsername] = useState();
  const history = useHistory();
  const userName = 'root';
  const onFinish = async (values) => {
    console.log(values);

    // login(values).then((res) => {
    //   if (res.code === 200) {
    //     history.push('/home');
    //     localStorage.setItem('username', username);
    //   }
    // });
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
              name="userName"
              disabled
              fieldProps={{
                size: 'large',
                className: styles['login-form-item'],
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
              name="password"
              fieldProps={{
                size: 'large',
                className: styles['login-form-item'],
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

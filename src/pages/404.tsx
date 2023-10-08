/*
 * @author: samy
 * @email: yessz#foxmail.com
 * @time: 2022-10-28 14:24:01
 * @modAuthor: samy
 * @modTime: 2023-01-16 16:36:55
 * @desc:
 * Copyright © 2015~2023 BDP FE
 */
import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoFoundPage;

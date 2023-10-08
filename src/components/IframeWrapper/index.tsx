import React from 'react';
import Iframe from 'react-iframe';
import styles from './index.less';
import loginServer from '@/module/login.server';

class IframeWrapper extends React.PureComponent {
  _handleOnMessage = (event: { data: any; origin?: any }) => {
    const { data: { type = '' } = {} } = event;
    console.log('-----_handleOnMessage-----data---', event.data);
    // 验证消息来源地址
    switch (type) {
      case 'logout':
        loginServer.logout();
        break;
      case 'openUrl':
        break;
      case 'closeUrl':
        break;
      case 'deleteUrl':
        break;
      case 'reloadUrl':
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    window.addEventListener('message', this._handleOnMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this._handleOnMessage, false);
  }

  render() {
    // @ts-ignore
    const { iframeW = '100%', iframeH = '100%', route, ...restProps } = this.props;
    let url = route?.query?.goUrl;
    if (url.startsWith('/')) url = url.substring(1);
    if (url.indexOf('?') === -1) url += '?';
    // url = `${ROUTER_BASE}${url}`;
    const baseProps = {
      position: 'relative',
      display: 'block',
      width: iframeW,
      height: iframeH,
      url,
    };
    // @ts-ignore
    return <Iframe className={styles.systemIframe} {...baseProps} {...restProps} />;
  }
}
export default IframeWrapper;

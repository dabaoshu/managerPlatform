import { ConfigProvider, Modal } from 'antd';
import { token } from '../defaultSettings';
import { PromptContextProvider } from '@/utils/prompt';

export default function AntdConfigProvider({ children }) {
  return (
    <ConfigProvider theme={{ token: token }}>
      {children}
      <PromptContextProvider />
    </ConfigProvider>
  );
}

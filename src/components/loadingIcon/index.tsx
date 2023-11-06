import { LoadingOutlined } from '@ant-design/icons';

export default function LoadingIcon({ loading, children }) {
  return loading ? <LoadingOutlined /> : children;
}

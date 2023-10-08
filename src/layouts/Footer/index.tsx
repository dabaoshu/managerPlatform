import { DefaultFooter } from '@/components';
import { useIntl } from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.proName',
    defaultMessage: '浩鲸大数据平台',
  });
  const currentYear = new Date().getFullYear();
  return <DefaultFooter copyright={`${currentYear} by ${defaultMessage}`} />;
};

export default Footer;

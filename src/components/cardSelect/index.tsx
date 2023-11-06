import classnames from 'classnames';
import styles from './index.less';

const CheckedIcon = () => {
  return (
    <span role="img" className="anticon">
      <svg
        width="30"
        height="24"
        viewBox="0 0 30 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M30 24V0L0 24L30 24Z" fill="#0065FD" />
        <path
          d="M20.5653 18.1002L25.7763 12.5121C26.0058 12.2659 26.3914 12.2525 26.6376 12.482C26.8837 12.7115 26.8972 13.0971 26.6676 13.3433L21.2648 19.1371C20.9117 19.5157 20.3185 19.5364 19.9398 19.1833L16.7471 16.2061C16.501 15.9766 16.4875 15.591 16.717 15.3448C16.9466 15.0987 17.3322 15.0852 17.5783 15.3148L20.5653 18.1002Z"
          fill="white"
        />
      </svg>
    </span>
  );
};

export default function CardSelect<T = string>({
  options = [],
  value = [],
  onChange,
  className,
}: {
  options: { label: React.ReactNode; value: T }[];
  value?: T[];
  onChange?: (vals: T[]) => void;
  className?: string;
}) {
  const onSelect = (checked, val) => {
    if (checked) {
      const _values = value.filter((o) => o !== val);
      if (onChange) onChange(_values);
    } else {
      if (onChange) onChange([...value, val]);
    }
  };

  return (
    <div className={classnames(styles.CardSelect, className)}>
      <ul>
        {options.map((o) => {
          const selected = value.includes(o.value);
          return (
            <li
              key={o.value as React.Key}
              onClick={() => onSelect(selected, o.value)}
              className={classnames({ [styles.active]: selected })}
            >
              {o.label}
              {selected && (
                <span className={styles.checkedIcon}>
                  <CheckedIcon />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

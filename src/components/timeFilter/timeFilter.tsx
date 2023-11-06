import { forwardRef, useMemo, useImperativeHandle } from 'react';
import styles from './index.less';
import type { DatePickerProps } from 'antd';
import { Button, DatePicker, Popover } from 'antd';
import classnames from 'classnames';
import { CalendarOutlined, ClockCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMount, useSetState } from 'ahooks';
import { useHoverClick } from '@/hooks';
import { formatDate } from '@/utils/time';

const fasterList = [
  {
    label: '最近 1 小时',
    value: 60 * 60 * 1000,
    startShowLabel: '现在-1 小时',
    endShowLabel: '现在',
  },
  {
    label: '最近 8 小时',
    value: 8 * 60 * 60 * 1000,
    startShowLabel: '现在-8 小时',
    endShowLabel: '现在',
  },
  { label: '今天', value: 0, startShowLabel: '现在', endShowLabel: '现在' },
  { label: '昨天', value: 24 * 60 * 60 * 1000, startShowLabel: '现在-1 天', endShowLabel: '现在' },
  {
    label: '最近 1 周',
    value: 7 * 24 * 60 * 60 * 1000,
    startShowLabel: '现在-1 周',
    endShowLabel: '现在',
  },
];

const getTimeState = (val) => {
  const nowDate = dayjs();
  const option = fasterList.find((o) => o.value === val);
  if (val === 0) {
    return {
      startValue: nowDate.clone().startOf('day'),
      endValue: nowDate.endOf('day'),
      fasterValue: val,
      startShowLabel: option.startShowLabel,
      endShowLabel: option.endShowLabel,
    };
  } else {
    return {
      startValue: nowDate.clone().add(-val, 'milliseconds'),
      endValue: nowDate.endOf('day'),
      fasterValue: val,
      startShowLabel: option.startShowLabel,
      endShowLabel: option.endShowLabel,
    };
  }
};

type TimePickProps = DatePickerProps & {
  label: string;
  showLabel: string;
};

const TimePick = ({ label, showLabel, value, onChange, onOk, ...props }: TimePickProps) => {
  return (
    <div className={styles.timePick}>
      <div className={styles.PickLabel}>{label}</div>
      <div className={styles.PickInput}>
        <div className={styles.PickInputLabel}>
          <div className={styles.PickInputLabelText}>{showLabel}</div>
          <div className={styles.PickInputLabelIcon}>
            <CalendarOutlined />
          </div>
        </div>
        <DatePicker
          className={styles.realPick}
          value={value}
          // @ts-expect-error
          showTime
          onChange={onChange}
          onOk={onOk}
          {...props}
        />
      </div>
    </div>
  );
};

export const TimeFilter = forwardRef<
  { getValues: () => [dayjs.Dayjs, dayjs.Dayjs]; initValues: (value: any) => void },
  {
    defaultValue: number | [dayjs.Dayjs, dayjs.Dayjs];
    onOk: (value: [dayjs.Dayjs, dayjs.Dayjs]) => void;
  }
>(({ defaultValue, onOk }, ref) => {
  const { clicked, hovered, handleHoverChange, handleClickChange, hide } = useHoverClick();

  const [
    { startValue, endValue, fasterValue, startShowLabel, endShowLabel, endPickerOpen },
    setTimeValue,
  ] = useSetState({
    startValue: undefined,
    startShowLabel: '',
    endValue: undefined,
    endShowLabel: '',
    fasterValue: undefined,
    endPickerOpen: false,
  });

  const { label, toolTipStart, toolTipEnd } = useMemo(() => {
    const fasterLabel = fasterList.find((o) => o.value === fasterValue)?.label;
    return {
      label: fasterLabel ? fasterLabel : `${startShowLabel}-${endShowLabel}`,
      toolTipStart: formatDate(startValue),
      toolTipEnd: formatDate(endValue),
    };
  }, [endShowLabel, startShowLabel, fasterValue, startValue, endValue]);

  const onPickerChange = (type, value: DatePickerProps['value'], dateString: string) => {
    if (type === 'start') {
      setTimeValue({
        startValue: value,
        endValue: value,
        startShowLabel: dateString,
        endPickerOpen: true,
        fasterValue: undefined,
      });
    } else {
      setTimeValue({
        endValue: value,
        endShowLabel: dateString,
        endPickerOpen: false,
        fasterValue: undefined,
      });
    }
  };

  const onFasterSelectChange = (val) => {
    const data = getTimeState(val);
    setTimeValue(data);
  };

  const initValues = (val) => {
    if (typeof val === 'number') {
      onFasterSelectChange(val);
    } else if (Array.isArray(val)) {
      const [start, end] = val;
      setTimeValue({
        startShowLabel: start ? formatDate(start) : '',
        startValue: start ? start : undefined,
        endValue: end ? end : undefined,
        endShowLabel: end ? formatDate(end) : '',
      });
    }
  };

  const getRealValues: () => [dayjs.Dayjs, dayjs.Dayjs] = () => {
    if (fasterValue) {
      const data = getTimeState(fasterValue);
      return [data.startValue, data.endValue];
    }
    return [startValue, endValue];
  };

  useImperativeHandle(ref, () => {
    return {
      getValues: getRealValues,
      initValues,
    };
  });
  useMount(() => {
    initValues(defaultValue);
  });

  return (
    <div className={styles.timeFilter}>
      <Popover
        trigger="hover"
        open={hovered}
        onOpenChange={handleHoverChange}
        content={
          <div>
            <div>{toolTipStart}</div>
            <div>-</div>
            <div>{toolTipEnd}</div>
          </div>
        }
      >
        <Popover
          trigger="click"
          onOpenChange={handleClickChange}
          open={clicked}
          content={
            <div className={styles.TimeRangePopover}>
              <div className={styles.rangeSelect}>
                <div>时间范围</div>
                <TimePick
                  value={startValue}
                  label={'开始时间'}
                  showLabel={startShowLabel}
                  onChange={(...args) => onPickerChange('start', ...args)}
                  allowClear={false}
                  disabledDate={(current) => {
                    if (fasterValue) {
                      return current && current > endValue?.add(2, 'day');
                    }
                    return current && current > endValue;
                  }}
                  onOpenChange={() => {
                    setTimeValue({
                      endPickerOpen: false,
                    });
                  }}
                />
                <TimePick
                  label={'结束时间'}
                  value={endValue}
                  allowClear={false}
                  open={endPickerOpen}
                  showLabel={endShowLabel}
                  onChange={(...args) => onPickerChange('end', ...args)}
                  onOpenChange={(open) => {
                    setTimeValue({
                      endPickerOpen: open,
                    });
                  }}
                  disabledDate={(current) => {
                    return current && current < startValue?.endOf('day');
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    hide();
                    onOk([startValue, endValue]);
                  }}
                >
                  确定
                </Button>
              </div>
              <div className={styles.fasterSelect}>
                {fasterList.map((o) => {
                  const selected = o.value === fasterValue;
                  return (
                    <div
                      className={classnames(styles.fasterSelectItem, {
                        [styles.selected]: selected,
                      })}
                      key={o.value}
                      onClick={() => onFasterSelectChange(o.value)}
                    >
                      {o.label}
                    </div>
                  );
                })}
              </div>
            </div>
          }
        >
          <div className={styles.label}>
            <ClockCircleOutlined />
            {label}
            <span style={{ fontSize: 10 }}>{clicked ? <UpOutlined /> : <DownOutlined />} </span>
          </div>
        </Popover>
      </Popover>
    </div>
  );
});

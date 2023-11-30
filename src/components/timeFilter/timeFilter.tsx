import { forwardRef, useMemo, useImperativeHandle, useState } from 'react';
import styles from './index.less';
import type { DatePickerProps } from 'antd';
import { Button, DatePicker, Popover, Row, Col, Space } from 'antd';
import classnames from 'classnames';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UpOutlined,
  DownOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMount, useSetState } from 'ahooks';
import { useHoverClick } from '@/hooks';
import { formatDate } from '@/utils/time';
import _ from 'lodash';

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

const realtimeList = [
  [
    {
      label: '5秒',
      value: 5 * 1000,
    },
    {
      label: '10秒',
      value: 10 * 1000,
    },
    {
      label: '30秒',
      value: 30 * 1000,
    },
    {
      label: '45秒',
      value: 30 * 1000,
    },
  ],
  [
    {
      label: '1分种',
      value: 1 * 60 * 1000,
    },
    {
      label: '5分种',
      value: 5 * 60 * 1000,
    },
    {
      label: '15分种',
      value: 15 * 60 * 1000,
    },
    {
      label: '30分种',
      value: 30 * 60 * 1000,
    },
  ],
  [
    {
      label: '1小时',
      value: 1 * 60 * 60 * 1000,
    },
    {
      label: '2小时',
      value: 2 * 60 * 60 * 1000,
    },
    {
      label: '12小时',
      value: 2 * 60 * 60 * 1000,
    },
    {
      label: '1天',
      value: 24 * 60 * 60 * 1000,
    },
  ],
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

const TimePick = ({ label, showLabel, value, onChange, ...props }: TimePickProps) => {
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
          {...props}
        />
      </div>
    </div>
  );
};

export type TimeFilterRef = {
  getValues: () => [dayjs.Dayjs, dayjs.Dayjs, number];
  initValues: (value: any) => void;
};

export const TimeFilter = forwardRef<
  TimeFilterRef,
  {
    defaultValue: number | [dayjs.Dayjs, dayjs.Dayjs];
    refreshDuration?: number;
    onOk: (value: [dayjs.Dayjs, dayjs.Dayjs], duration: number) => void;
  }
>(({ defaultValue = 0, onOk, refreshDuration = 0 }, ref) => {
  const { clicked, hovered, handleHoverChange, handleClickChange, hide } = useHoverClick();

  const [
    { startValue, endValue, fasterValue, startShowLabel, endShowLabel, endPickerOpen },
    setTimeValue,
  ] = useSetState(() => {
    const obj = {
      endPickerOpen: false,
      fasterValue: undefined,
    };
    if (typeof defaultValue === 'number') {
      const data = getTimeState(defaultValue);
      return {
        ...obj,
        ...data,
      };
    } else if (Array.isArray(defaultValue)) {
      const [start, end] = defaultValue;
      return {
        ...obj,
        startShowLabel: start ? formatDate(start) : '',
        startValue: start ? start : undefined,
        endValue: end ? end : undefined,
        endShowLabel: end ? formatDate(end) : '',
      };
    }
    return {
      startValue: undefined,
      startShowLabel: '',
      endValue: undefined,
      endShowLabel: '',
      fasterValue: undefined,
      endPickerOpen: false,
    };
  });

  const [duration, setDuration] = useState(refreshDuration);

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

  const onRealTimeChange = (val) => {
    setDuration(val);
  };

  const initValues = (val, durationVal: number) => {
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
    onRealTimeChange(durationVal);
  };

  const getValues: () => [dayjs.Dayjs, dayjs.Dayjs, number] = () => {
    if (fasterValue) {
      const data = getTimeState(fasterValue);
      return [data.startValue, data.endValue, duration];
    }
    return [startValue, endValue, duration];
  };

  useImperativeHandle(ref, () => {
    return {
      getValues,
      initValues,
    };
  });

  useMount(() => {
    initValues(defaultValue, duration);
  });

  const RealIcon = (props) =>
    duration > 0 ? <CaretRightOutlined {...props} /> : <PauseOutlined {...props} />;
  const RealLabel = useMemo(() => {
    const list = _.flatten(realtimeList);
    const i = list.find((item) => item.value === duration) || {};
    return (
      <Space onClick={() => onRealTimeChange(0)} className={styles.timeFilterRealTitle} size={4}>
        <RealIcon />
        <div>{i.label}</div>
      </Space>
    );
  }, [duration]);

  return (
    <Space className={styles.timeFilter}>
      {(clicked || duration > 0) && <div className={styles.timeFilterTitle}>{RealLabel}</div>}
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
                    onOk([startValue, endValue], duration);
                  }}
                >
                  确定
                </Button>
              </div>
              <div className={styles.fasterSelect}>
                <div>快速选择</div>
                {fasterList.map((o) => {
                  const selected = o.value === fasterValue;
                  return (
                    <div
                      className={classnames(styles.selectItem, {
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
              <section className={styles.realTimeSelect}>
                <Space>
                  实时刷新 <RealIcon></RealIcon>
                </Space>
                <div className={classnames(styles.selectItem)} onClick={() => onRealTimeChange(0)}>
                  关闭实时
                </div>
                <Row className={styles.realTimeBox}>
                  {realtimeList.map((cols, idx) => {
                    return (
                      <Col key={idx} span={8}>
                        {cols.map((o) => {
                          const selected = o.value === duration;
                          return (
                            <div
                              className={classnames(styles.selectItem, {
                                [styles.selected]: selected,
                              })}
                              key={o.value}
                              onClick={() => onRealTimeChange(o.value)}
                            >
                              {o.label}
                            </div>
                          );
                        })}
                      </Col>
                    );
                  })}
                </Row>
              </section>
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
    </Space>
  );
});

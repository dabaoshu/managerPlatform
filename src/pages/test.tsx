import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { TaskDetail } from './task/components/TaskDetail';
import { ModalPrompt } from '@/utils/prompt';
export default function Test() {
  const kkRef = useRef();
  console.log(kkRef);

  useEffect(() => {
    ModalPrompt({
      props: {
        title: '查看任务状态',
        cancelText: false,
        width: 800,
      },
      data: {
        taskId: '171372ca-e476-303b-ef7b-84ade19f1954',
        refresh: true,
      },
      component: TaskDetail,
    }).then((res) => {
      console.log(res);
    });
  }, []);
  return (
    <div style={{ width: 800 }}>
      <TaskDetail
        ref={kkRef}
        {...{
          taskId: '171372ca-e476-303b-ef7b-84ade19f1954',
          refresh: true,
        }}
      ></TaskDetail>
    </div>
  );
}

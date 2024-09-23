import { AccountBookFilled } from '@ant-design/icons';

import { Button, Typography } from 'antd';

export function NxWelcome({ title }: { title: string }) {
  return (
    <>
      <Typography.Title>{title}</Typography.Title>
      <Button icon={<AccountBookFilled />}>Button from antd</Button>
    </>
  );
}

export default NxWelcome;

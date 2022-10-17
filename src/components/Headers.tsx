import { useUser } from '@/context/user';
import {
  Header,
  Group,
  Button,
  Box,
} from '@mantine/core';
import { MantineLogo } from '@mantine/ds';

export function Headers() {
  const { onSignOut } = useUser();
  return (
    <Box pb={50}>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          <MantineLogo size={30} />

          <Group>
            <Button onClick={() => onSignOut()}>ログアウト</Button>
          </Group>
        </Group>
      </Header>
    </Box>
  );
}

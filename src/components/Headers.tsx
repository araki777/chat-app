import { useSession } from '@/context/session';
import {
  Header,
  Group,
  Button,
  Box,
} from '@mantine/core';
import { MantineLogo } from '@mantine/ds';

export function Headers() {
  const { onSignOut } = useSession();
  return (
    <Box>
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

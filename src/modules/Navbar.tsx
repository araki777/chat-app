import { Group, Navbar, ThemeIcon, UnstyledButton, Text } from '@mantine/core'
import { IconPalette, IconVideo } from '@tabler/icons';
import { useRouter } from 'next/router'

const BaseNavbar = () => {
  const router = useRouter();

  return (
    <Navbar p="xs" sx={{ width: 300, height: "100%" }}>
      <Navbar.Section>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
        onClick={() => router.push(`${router.asPath}/canvas`)}
      >
      <Group>
        <ThemeIcon variant="light" children={<IconPalette />}></ThemeIcon>
        <Text size="sm">お絵描きルーム</Text>
      </Group>
    </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
        onClick={() => router.push(`${router.asPath}/video`)}
      >
        <Group>
          <ThemeIcon variant="light" children={<IconVideo />}></ThemeIcon>
          <Text size="sm">ビデオルーム</Text>
        </Group>
      </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section>{/* Footer with user */}</Navbar.Section>
    </Navbar>
  )
}

export default BaseNavbar

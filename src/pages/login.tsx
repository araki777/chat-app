import { NextPage } from 'next';
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Group,
  Grid
} from '@mantine/core';
import { useForm } from '@mantine/form'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://source.unsplash.com/random)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

interface SignInFormInput {
  email: string,
  password: string
}

const SignIn: NextPage = () => {
  const { classes } = useStyles();
  const { onSignIn, onSignInWithGoogle, onSignInWithGitHub } = useAuth()
  const form = useForm<SignInFormInput>({
    initialValues: {
      email: "",
      password: ""
    },
  });

  const formOnSubmit = async (data: SignInFormInput) => {
    const { email, password } = data;
    await onSignIn(email, password)
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          My App
        </Title>

        <form onSubmit={form.onSubmit(formOnSubmit)}>
          <TextInput
            withAsterisk
            label="メールアドレス"
            placeholder="メールアドレスを入力してください"
            size="md"
            {...form.getInputProps('name')}
          />
          <PasswordInput
            withAsterisk
            label="パスワード"
            placeholder="パスワードを入力してください"
            mt="md" size="md"
            {...form.getInputProps('password')}
          />
          <Button type="submit" mt="xl" fullWidth>ログイン</Button>
          <Grid justify="space-around" mt="xl">
            <Grid.Col span="auto" sx={{textAlign: "center"}}>
              <Button variant="outline" onClick={onSignInWithGoogle} sx={{width: 80, height: 60}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
                </svg>
              </Button>
            </Grid.Col>
            <Grid.Col span="auto" sx={{textAlign: "center"}}>
              <Button variant="outline" onClick={onSignInWithGitHub} sx={{width: 80, height: 60}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                </svg>
              </Button>
            </Grid.Col>
          </Grid>
          <Group spacing="lg" mt="lg" position="right">
            <span>
              アカウントをお持ちではありませんか？
              <Link href="/signUp">会員登録</Link>
            </span>
          </Group>
        </form>
      </Paper>
    </div>
  )
}

export default SignIn

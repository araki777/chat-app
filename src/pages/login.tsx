import { NextPage } from "next";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Group,
  Grid,
  Box,
  BackgroundImage,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useSession } from "@/context/session";
import { SessionGuard } from "@/guards/SessionGuard";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },

  input: {
    [`input[type="text"]:focus`]: {
      border: "1px solid #7f7fff",
    },
    [`.mantine-PasswordInput-input:focus-within`]: {
      border: "1px solid #7f7fff",
    },
  },

  button: {
    background: "#ced4da",
    webkitTransition: "all 0.3s ease",
    mozTransition: "all 0.3s ease",
    oTransition: "all 0.3s ease",
    transition: "all  0.3s ease",
  },
}));

interface SignInFormInput {
  email: string;
  password: string;
}

const SignIn: NextPage = () => {
  const { classes } = useStyles();
  const { onSignIn, onSignInWithGoogle, onSignInWithGitHub, loading } =
    useSession();
  const form = useForm<SignInFormInput>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/.test(value)
          ? null
          : "無効なメールアドレスです",
      password: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const handleError = (errors: typeof form.errors) => {
    if (errors.email) {
      showNotification({ message: "メールアドレスを入力してください" });
    } else if (errors.password) {
      showNotification({ message: "パスワードを入力してください" });
    }
  };

  const formOnSubmit = async (data: SignInFormInput) => {
    const { email, password } = data;
    // await onSignIn(email, password);
  };

  return (
    <SessionGuard>
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={1}
            className={classes.title}
            align="center"
            mt="md"
            mb={50}
            sx={{ fontFamily: "Griffy !important" }}
          >
            Talk Out
          </Title>

          <form onSubmit={form.onSubmit(formOnSubmit, handleError)}>
            <TextInput
              withAsterisk
              label="メールアドレス"
              placeholder="aaa@example.com"
              size="xs"
              className={classes.input}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              withAsterisk
              label="パスワード"
              placeholder="password"
              mt="md"
              size="xs"
              className={classes.input}
              {...form.getInputProps("password")}
            />
            <Button
              type="submit"
              mt="xl"
              fullWidth
              loading={loading}
              className={classes.button}
            >
              ログイン
            </Button>
            <Grid justify="space-around" mt="xl">
              <Grid.Col span="auto" sx={{ textAlign: "center" }}>
                <Button
                  variant="outline"
                  onClick={onSignInWithGoogle}
                  sx={{ width: 80, height: 60 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
                  </svg>
                </Button>
              </Grid.Col>
              <Grid.Col span="auto" sx={{ textAlign: "center" }}>
                <Button
                  variant="outline"
                  onClick={onSignInWithGitHub}
                  sx={{ width: 80, height: 60 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
        <BackgroundImage src="https://source.unsplash.com/random" />
      </div>
    </SessionGuard>
  );
};

export default SignIn;

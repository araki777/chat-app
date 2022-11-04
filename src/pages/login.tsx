import { NextPage } from "next";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Group,
  BackgroundImage,
  Divider,
  Avatar,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useSession } from "@/context/session";
import { SessionGuard } from "@/guards/SessionGuard";
import { useStyles } from "@/styles/pages/login"

interface SignInFormInput {
  email: string;
  password: string;
}

const SignIn: NextPage = () => {
  const { classes } = useStyles();
  const { onSignIn, onSignInWithTwitter, onSignInWithGoogle, onSignInWithGitHub, loading } =
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

  const formOnSubmit = async (data: SignInFormInput) => {
    const { email, password } = data;
    await onSignIn(email, password);
  };

  return (
    <SessionGuard>
      <div className={classes.wrapper}>
        <Paper className={classes.form}>
          <Title order={1} className={classes.title}>
            Talk Out
          </Title>

          <form onSubmit={form.onSubmit(formOnSubmit)}>
            <TextInput
              withAsterisk
              label="メールアドレス"
              placeholder="aaa@example.com"
              className={classes.input}
              size="xs"
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
              fullWidth
              loading={loading}
              className={classes.button}
            >
              ログイン
            </Button>
            <Link href="/sendEmail">
              <a className={classes.link}>パスワードをお忘れですか？</a>
            </Link>
            <Divider
              label="SNSアカウントでログイン"
              labelPosition="center"
              color="#ced4da"
              className={classes.divider}
            />
            <Group mt="xl">
              <Avatar
                onClick={onSignInWithTwitter}
                className={classes.avatar}
              >
                <svg
                  width="20px"
                  height="20px"
                  version="1.1"
                  id="Logo"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 248 204"
                >
                  <path
                    fill="#1976D2"
                    d="M221.95,51.29c0.15,2.17,0.15,4.34,0.15,6.53c0,66.73-50.8,143.69-143.69,143.69v-0.04
		C50.97,201.51,24.1,193.65,1,178.83c3.99,0.48,8,0.72,12.02,0.73c22.74,0.02,44.83-7.61,62.72-21.66
		c-21.61-0.41-40.56-14.5-47.18-35.07c7.57,1.46,15.37,1.16,22.8-0.87C27.8,117.2,10.85,96.5,10.85,72.46c0-0.22,0-0.43,0-0.64
		c7.02,3.91,14.88,6.08,22.92,6.32C11.58,63.31,4.74,33.79,18.14,10.71c25.64,31.55,63.47,50.73,104.08,52.76
		c-4.07-17.54,1.49-35.92,14.61-48.25c20.34-19.12,52.33-18.14,71.45,2.19c11.31-2.23,22.15-6.38,32.07-12.26
		c-3.77,11.69-11.66,21.62-22.2,27.93c10.01-1.18,19.79-3.86,29-7.95C240.37,35.29,231.83,44.14,221.95,51.29z"
                  />
                </svg>
              </Avatar>
              <Avatar
                onClick={onSignInWithGitHub}
                className={classes.avatar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Avatar>
              <Avatar
                onClick={onSignInWithGoogle}
                className={classes.avatar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="20px"
                  height="20px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              </Avatar>
            </Group>
            <Group spacing="lg" mt="lg" position="right">
              <span className={classes.span}>
                アカウントをお持ちではありませんか？
                <Link href="/signUp">
                  <a>今すぐ作成</a>
                </Link>
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

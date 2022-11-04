import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "@/context/session";
import {
  TextInput,
  Button,
  Group,
  Box,
  Container,
  Title,
  Anchor,
  Paper,
  PasswordInput,
  Checkbox,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useStyles } from "@/styles/pages/signUp";

interface SignUpFormInput {
  name: string;
  email: string;
  password: string;
}

const SignUp: NextPage = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const { onSignUp, loading } = useSession();
  const form = useForm<SignUpFormInput>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const formOnSubmit = async (data: SignUpFormInput) => {
    const { name, email, password } = data;
    await onSignUp(email, password, name);
  };

  return (
    <Container size={420} my={40} className={classes.container}>
      <Title className={classes.title}>アカウントを作成</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          withAsterisk
          label="氏名"
          placeholder="名前を入力してください"
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          mt="md"
          label="メールアドレス"
          placeholder="メールアドレスを入力してください"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="パスワード"
          placeholder="パスワードを入力してください"
          mt="md"
          {...form.getInputProps("password")}
        />
        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            アカウント登録
          </Button>
          <Button onClick={() => router.push("/login")}>戻る</Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default SignUp;

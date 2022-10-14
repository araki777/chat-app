import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useUser } from '@/context/user';
import { TextInput, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form'

interface SignUpFormInput {
  name: string;
  email: string;
  password: string;
}

const SignUp: NextPage = () => {
  const router = useRouter()
  const { onSignUp } = useUser();
  const form = useForm<SignUpFormInput>({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
  });

  const formOnSubmit = async (data: SignUpFormInput) => {
    console.log(data);
    const { name, email, password } = data;
    await onSignUp(email, password, name)
  }

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit(formOnSubmit)}>
        <TextInput
          withAsterisk
          label="氏名"
          placeholder="名前を入力してください"
          {...form.getInputProps('name')}
        />
        <TextInput
          withAsterisk
          label="メールアドレス"
          placeholder="メールアドレスを入力してください"
          {...form.getInputProps('email')}
        />
        <TextInput
          withAsterisk
          label="パスワード"
          placeholder="パスワードを入力してください"
          {...form.getInputProps('password')}
        />
        <Group position="right" mt="md">
          <Button type="submit">送信</Button>
          <Button onClick={() => router.push('/login')}>ログイン画面へ</Button>
        </Group>
      </form>
    </Box>
  )
}

export default SignUp;

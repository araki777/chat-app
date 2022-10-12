import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth'
import { TextInput, Select, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form'

interface SignUpFormInput {
  name: string;
  email: string;
  password: string;
  employeePosition: number;
}

const SignUp: NextPage = () => {
  const router = useRouter()
  const { onSignUp } = useAuth();
  const form = useForm<SignUpFormInput>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      employeePosition: 0
    },
  });

  const formOnSubmit = async (data: SignUpFormInput) => {
    console.log(data);
    const { name, email, password, employeePosition } = data;
    if (employeePosition === 0) {
      return;
    }
    await onSignUp(email, password, name, employeePosition)
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
        <Select withAsterisk label="職位" placeholder="職位を選んでください"
          data={[
            {value: "1", label: '正社員'},
            {value: "2", label: '業務委託'},
            {value: "3", label: 'バイト'}
          ]} {...form.getInputProps('employeePosition')} />
        <Group position="right" mt="md">
          <Button type="submit">送信</Button>
          <Button onClick={() => router.push('/login')}>ログイン画面へ</Button>
        </Group>
      </form>
    </Box>
  )
}

export default SignUp;

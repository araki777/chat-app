import {
  Button,
  Group,
  Modal,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Home: NextPage = () => {
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      roomName: "",
      count: 1,
    },

    validate: {
      roomName: (value) =>
        value.length === 0
          ? "部屋名を入力してください"
          : value.length > 10
          ? "文字数が多すぎます"
          : null,
      count: (value) =>
        value < 1
          ? "部屋人数を1人より少なくすることは出来ません"
          : value > 10
          ? "部屋人数を10人以上にしないでください"
          : null,
    },
  });

  const onSubmit = (values: { roomName: string; count: Number }) => {
    setOpened(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="ルーム新規作成"
        closeOnClickOutside={false}
      >
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <TextInput
            placeholder="部屋名を入力してください"
            label="部屋名"
            withAsterisk
            description="10文字まで"
            {...form.getInputProps("roomName")}
          />
          <NumberInput
            label="部屋人数"
            description="最大10人まで"
            placeholder="人数を入力してください"
            max={10}
            min={1}
            defaultValue={1}
            mt="md"
            {...form.getInputProps("count")}
          />
          <Button type="submit" color="violet" mt="md" sx={{ float: "right" }}>
            作成
          </Button>
        </form>
      </Modal>
      <Group position="center">
        <Button onClick={() => setOpened(true)}>ルーム新規作成</Button>
      </Group>
    </>
  );
  return <></>;
};

export default Home;

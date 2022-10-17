import { useUser } from "@/context/user";
import UserGuard from "@/guards/userGuard";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Headers } from '@/components/Headers'

const Home: NextPage = () => {
  const [opened, setOpened] = useState(false);
  const [socket, _] = useState(() => io());
  const [rooms, setRooms] = useState([]) as any;
  const { user } = useUser();

  const form = useForm({
    initialValues: {
      roomName: "",
      capacity: 1,
      isRelease: false
    },

    validate: {
      roomName: (value) =>
        value.length === 0
          ? "部屋名を入力してください"
          : value.length > 10
          ? "文字数が多すぎます"
          : null,
      capacity: (value) =>
        value < 1
          ? "部屋人数を1人より少なくすることは出来ません"
          : value > 10
          ? "部屋人数を10人以上にしないでください"
          : null,
    },
  });

  useEffect(() => {
    socket.emit("room list", _, (replace: any) => {
      replace.map((data: any) => (
        setRooms([...rooms, data.roomName])
      ))
    });
  }, []);

  const onSubmit = (values: any) => {
    const data = {
      ...values,
      userId: user?.id
    }
    socket.emit("create room", (data), (response: any) => {
      if (response) {
        setRooms([...rooms, response.roomName]);
      }
    });
    setOpened(false);
  };

  return (
    <UserGuard>
      <Headers />
      <h2>ルーム一覧</h2>
      { rooms ? rooms.map((data: any) => (
        <h6>{data}</h6>
      )) : <h6>部屋がありません</h6> }
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
            withAsterisk
            {...form.getInputProps("capacity")}
          />
          <Checkbox
            label="公開する"
            mt="md"
            {...form.getInputProps("isRelease", { type: "checkbox" })}
          />
          <Button type="submit" color="violet" mt="md" sx={{ float: "right" }}>
            作成
          </Button>
        </form>
      </Modal>
      <Group position="center">
        <Button onClick={() => setOpened(true)}>ルーム新規作成</Button>
      </Group>
    </UserGuard>
  );
};

export default Home;

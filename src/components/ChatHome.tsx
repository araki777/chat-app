import type { NextPage } from "next";
import { useSession } from "@/context/session";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Switch,
  TextInput,
  Table,
  ScrollArea,
  createStyles
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Headers } from '@/components/Headers';
import axios from 'axios';
import { useRouter } from 'next/router';


const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const ChatHome: NextPage = () => {
  const [opened, setOpened] = useState(false);
  const [rooms, setRooms] = useState<any>([]);
  const [scrolled, setScrolled] = useState(false);
  const { classes, cx } = useStyles();
  const { setSocket, socket } = useSession();
  const router = useRouter();

  const handleRowClick = (row: any) => {
    router.push(`/chatRooms/${row.id}`)
  }

  const rows = rooms.map((row: any) => (
    <tr key={row.id} onClick={() => handleRowClick(row)}>
      <td>{row.room_name}</td>
      <td>{row.capacity}</td>
      <td>{row.user_id}</td>
      <td>{row.isRelease}</td>
    </tr>
  ));

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

    // socketがない場合のみ、セットする
    if (!socket) {
      setSocket(io())
    }

    // socket?.emit('join', user?.data.join_room_list)

    const firstRoomGet = async () => {
      const response = await axios.get(`/api/rooms/first-get`);
      setRooms(response.data.firstRooms);
    }
    firstRoomGet()
  }, []);

  const onSubmit = (values: any) => {
    // const data = {
    //   ...values,
    //   userId: user?.data.id
    // }
    // const createRoom = async () => {
    //   const response = await axios.post(`/api/rooms/create`, data)
    //   if (response.data) {
    //     setRooms([...rooms, response.data])
    //   }
    // }
    // createRoom();
    // setOpened(false);
  };

  const toggleChange = () => {
  }

  return (
    <>
      <Headers />
      <Group position="center" my={30}>
        <Switch onChange={() => toggleChange()} size="lg" onLabel={<div>グローバル</div>} offLabel={<div>ローカル</div>} />
      </Group>
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
      <ScrollArea sx={{ height: 400 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table sx={{ minWidth: 700 }}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>部屋名</th>
              <th>制限人数</th>
              <th>オーナー</th>
              <th>公開・非公開</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  )
}

export default ChatHome

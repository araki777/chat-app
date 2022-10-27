import { SessionGuard } from "@/guards/SessionGuard";
import type { NextPage } from "next";
import { useSession } from "@/context/session";
import { Button, Group, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import { Headers } from "@/components/Headers";
import { useRouter } from "next/router";
import BaseTable from "@/components/Table";
import BaseModal from "@/components/Modal";
import { roomType } from "@/types/room";

const ChatHome: NextPage = () => {
  const [rooms, setRooms] = useState<roomType[]>([]);
  const [opened, setOpened] = useState<boolean>(false);
  const { socket, sessionUser } = useSession();
  const router = useRouter();

  useEffect(() => {
    // ログインユーザーが登録されている部屋に参加
    if (sessionUser?.join_room_list.length) {
      socket?.emit(
        "joinUserRoom",
        { joinRoomList: sessionUser.join_room_list, userId: sessionUser.id },
        (response: roomType[]) => {
          setRooms(response);
        }
      );
    }
  }, [socket]);

  // tableの行を押した時の挙動
  const handleRowClick = (row: any) => {
    router.push(`/chatRooms/${row.id}`);
  };

  // tableのヘッダー情報
  const tableHeader = ["部屋名", "制限人数", "オーナー", "公開・非公開"];

  return (
    <SessionGuard>
      <Headers />
      <BaseModal
        opened={opened}
        setOpened={setOpened}
        rooms={rooms}
        setRooms={setRooms}
        status="createRoom"
        title="ルーム新規作成"
      />
      <Group position="center" my={30}>
        <Switch
          size="lg"
          onLabel={<div>グローバル</div>}
          offLabel={<div>ローカル</div>}
        />
      </Group>
      <Group position="center">
        <Button onClick={() => setOpened(true)}>ルーム新規作成</Button>
      </Group>
      <BaseTable
        handleRowClick={handleRowClick}
        tableRows={rooms}
        tableHeader={tableHeader}
      />
    </SessionGuard>
  );
};

export default ChatHome;

import { Button, Checkbox, Modal, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, FC, SetStateAction } from "react";
import { roomType } from "@/types/room";
import { useSession } from "@/context/session";

interface createRoomFormProps {
  setOpened: Dispatch<SetStateAction<boolean>>;
  rooms: roomType[];
  setRooms: Dispatch<SetStateAction<roomType[]>>;
}

type formValueType = {
  roomName: string;
  capacity: number;
  isRelease: boolean;
};

export const CreateRoomForm: FC<createRoomFormProps> = ({
  setOpened,
  rooms,
  setRooms,
}) => {
  const { socket, sessionUser } = useSession();
  const form = useForm({
    initialValues: {
      roomName: "",
      capacity: 1,
      isRelease: false,
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

  const onSubmit = (values: formValueType) => {
    const data = {
      ...values,
      userId: sessionUser?.id,
    };
    socket?.emit("createRoom", data, (response: roomType) => {
      setRooms([...rooms, response]);
      setOpened(false);
    });
  };

  return (
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
  );
};

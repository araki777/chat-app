import { useForm } from "@mantine/form";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { roomType } from "@/types/room";
import { useSession } from "@/context/session";
import FormTextInput from "@/components/FormTextInput"
import FormNumberInput from "@/components/FormNumberInput"
import FormCheckBox from "@/components/FormCheckBox";
import FormButton from "@/components/FormButton"

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

const CreateRoomForm: FC<createRoomFormProps> = ({
  setOpened,
  rooms,
  setRooms,
}) => {
  const { socket, sessionUser } = useSession();
  const [loading, setLoading] = useState(false);
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
    try {
      setLoading(true)
      const data = {
        ...values,
        userId: sessionUser?.id,
      };
      socket?.emit("createRoom", data, (response: roomType) => {
        setRooms([...rooms, response]);
        setOpened(false);
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false)
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <FormTextInput placeholder="部屋名を入力してください" label="部屋名" withAsterisk={true} description="10文字まで" value={form.getInputProps("roomName")} />
      <FormNumberInput placeholder="人数を入力してください" label="部屋人数" withAsterisk={true} description="最大10人まで" max={10} min={1} defaultValue={1} value={form.getInputProps("capacity")} sx={{ marginTop: "16px" }} />
      <FormCheckBox label="公開する" value={form.getInputProps("isRelease", { type: "checkbox" })} sx={{ marginTop: "16px" }} />
      <FormButton type="submit" sx={{ float: "right", color: "#fff", background: "#845EF7", marginTop: "16px" }} value="作成" loading={loading} />
    </form>
  );
};

export default CreateRoomForm

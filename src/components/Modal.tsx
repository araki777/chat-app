import { useSession } from '@/context/session';
import { Button, Checkbox, Modal, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dispatch, FC, SetStateAction } from 'react';

type Props = {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
  rooms?: any
  setRooms: Dispatch<SetStateAction<any>>
}

const BaseModal: FC<Props> = (props) => {
  const { socket, sessionUser } = useSession()

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

  const onSubmit = (values: any) => {
    const data = {
      ...values,
      userId: sessionUser?.id
    }
    socket?.emit('createRoom', data, (response: any) => {
      props.setRooms([...props.rooms, response]);
    })
  };

  return (
    <Modal
    opened={props.opened}
    onClose={() => props.setOpened(false)}
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
  )
}

export default BaseModal

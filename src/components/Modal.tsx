import { Modal } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";
import CreateRoomForm from "@/components/CreateRoomForm";
import { roomType } from "@/types/room";

type Props = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  status: string;
  title: string;
  rooms?: roomType[];
  setRooms?: Dispatch<SetStateAction<roomType[]>>;
};

const BaseModal: FC<Props> = (props) => {
  const modalContent = (status: string) => {
    if (status === "createRoom") {
      return (
        <CreateRoomForm
          setOpened={props.setOpened}
          rooms={props.rooms!}
          setRooms={props.setRooms!}
        />
      );
    }
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title={props.title}
      closeOnClickOutside={false}
    >
      {modalContent(props.status)}
    </Modal>
  );
};

export default BaseModal;

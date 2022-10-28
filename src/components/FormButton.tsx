import { Button } from "@mantine/core";
import { FC } from "react";

interface Props {
  type: "button" | "submit" | "reset" | undefined;
  value: string;
  sx?: {[key: string]: string}
  loading: boolean
}

const FormButton: FC<Props> = (props) => {
  return (
    <Button type={props.type} sx={props.sx} loading={props.loading}>
      {props.value}
    </Button>
  )
};

export default FormButton

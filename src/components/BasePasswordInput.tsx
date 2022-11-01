import { PasswordInput } from "@mantine/core";
import { FC } from "react";

interface Props {
  placeholder: string;
  label: string;
  withAsterisk: boolean;
  description?: string;
  value: any;
  sx?: {[key: string]: string}
}

const BasePasswordInput: FC<Props> = (props) => {
  return (
    <PasswordInput
      placeholder={props.placeholder}
      label={props.label}
      withAsterisk={props.withAsterisk}
      description={props.description}
      {...props.value}
      sx={props.sx}
    />
  )
};

export default BasePasswordInput

import { TextInput } from "@mantine/core";
import { FC } from "react";

interface Props {
  placeholder: string;
  label: string;
  withAsterisk: boolean;
  description?: string;
  value: any;
  sx?: {[key: string]: string}
}

const BaseTextInput: FC<Props> = (props) => {
  return (
    <TextInput
      placeholder={props.placeholder}
      label={props.label}
      withAsterisk={props.withAsterisk}
      description={props.description}
      {...props.value}
      sx={props.sx}
    />
  )
};

export default BaseTextInput

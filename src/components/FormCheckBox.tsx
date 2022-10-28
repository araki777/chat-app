import { Checkbox } from "@mantine/core";
import { FC } from "react";

interface Props {
  label: string;
  value: any;
  sx?: {[key: string]: string}
}

const FormCheckBox: FC<Props> = (props) => {
  return (
    <Checkbox
      label={props.label}
      value={props.value}
      sx={props.sx}
    />
  )
};

export default FormCheckBox

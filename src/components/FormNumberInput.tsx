import { NumberInput } from "@mantine/core";
import { FC } from "react";

interface Props {
  placeholder: string;
  label: string;
  withAsterisk: boolean;
  description?: string;
  value: any;
  max: number;
  min: number;
  defaultValue: number;
  sx?: {[key: string]: string}
}

const FormNumberInput: FC<Props> = (props) => {
  return (
    <NumberInput
      label={props.label}
      description={props.description}
      placeholder={props.placeholder}
      max={props.max}
      min={props.min}
      defaultValue={props.defaultValue}
      withAsterisk={props.withAsterisk}
      {...props.value}
      sx={props.sx}
    />
  )
};

export default FormNumberInput

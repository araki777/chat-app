import { Button } from "@mantine/core";
import React, { FC, ReactNode } from "react";

interface Props {
  type: "button" | "submit" | "reset" | undefined;
  value: string | ReactNode;
  sx?: {[key: string]: string}
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  loading: boolean
}

const BaseButton: FC<Props> = (props) => {
  return (
    <Button type={props.type} sx={props.sx} loading={props.loading}>
      {props.value}
    </Button>
  )
};

export default BaseButton

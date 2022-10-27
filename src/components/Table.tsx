import { Table } from "@mantine/core";
import { FC } from "react";
import { roomType } from "@/types/room";

type Props = {
  handleRowClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  tableRows: roomType[];
  tableHeader: string[];
};

const BaseTable: FC<Props> = (props) => {
  const rows = props.tableRows.map((row: any) => (
    <tr
      key={row.id}
      onClick={() => (props.handleRowClick ? props.handleRowClick(row) : {})}
    >
      <td>{row.room_name}</td>
      <td>{row.capacity}</td>
      <td>{row.user_id}</td>
      <td>{row.isRelease ? "公開" : "非公開"}</td>
    </tr>
  ));

  const headers = props.tableHeader.map((header: string, index: number) => {
    return <th key={index}>{header}</th>;
  });

  return (
    <Table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default BaseTable;

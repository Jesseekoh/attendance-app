import { ColumnDef } from '@tanstack/react-table';

type Student = {
  id: string;
  name: string;
  matricNumber: string;
  attended: boolean;
};

export const Columns: ColumnDef<Student>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'matricNumber',
    header: 'Matric Number',
  },
  {
    accessorKey: 'attended',
    header: 'Status',
    cell: ({ row }) => {
      return row.getValue('attended') ? 'Present' : 'Missed';
    },
  },
];

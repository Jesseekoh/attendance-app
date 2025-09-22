import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type Student = {
  id: string;
  name: string;
  matricNumber: string;
  attended: boolean;
};

export const Columns: ColumnDef<Student>[] = [
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
      const attended: boolean = row.getValue('attended');
      return (
        <Badge
          variant={attended ? 'default' : 'destructive'}
          className={cn(attended && 'bg-green-600')}
        >
          {attended ? 'Present' : 'Missed'}
        </Badge>
      );
    },
  },
];

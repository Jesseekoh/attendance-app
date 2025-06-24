import React, { SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '../lib/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
// import { useNavigate } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};
export type Course = {
  id: string;
  title: string;
  code: string;
  // desc: string;
};

type props = {
  setIsEditing: React.Dispatch<SetStateAction<boolean>>;
};

const EditCourses = ({ setIsEditing }: props) => {
  const { user } = useAuth();
  // const navigate = useNavigate();
  const {
    data: myCourses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await api.get(`/${user?.role}s/courses`);
      console.log(response);
      return response.data.data;
    },
  });

  const { data: allCourses } = useQuery({
    queryKey: ['all-courses'],
    queryFn: async () => {
      const resp = await api.get('/courses');
      return resp.data.data;
    },
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (myCourses) {
      setCourses(myCourses);
    }
  }, [myCourses]);
  const columns: ColumnDef<Course>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'code',
      header: 'code',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('code')}</div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'title',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('title')}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const course = row.original;

        return (
          <>
            <Button
              variant="destructive"
              onClick={() => {
                const updatedCourses = courses.filter(
                  (items) => items.id !== course.id
                );
                setCourses(updatedCourses);
                console.log(`Closing ${course.code}`);
              }}
            >
              <X />
            </Button>
          </>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: courses,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // handles sending all selected courses to the course enrollment endpoint
  const handleSubmit = async () => {
    try {
      const courseIds = courses.map((course) => course.id);
      const resp = await api.post('/students/courses', { courses: courseIds });

      if (resp.status === 200) {
        toast.success('Successfully added courses');
        setIsEditing(false);
        // navigate('/courses', { replace: true });
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to add courses');
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return (
      <Card className="bg-red-500/80">
        <CardContent>
          <p className="text-red-200">Error loading courses</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  You have no courses selected. Add courses
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <Select
          onValueChange={(value) => {
            setSelectedCourse(value);
          }}
          value={selectedCourse}
          defaultValue={''}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              {allCourses &&
                allCourses.map((item: Course) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                  >{`${item.code} - ${item.title}`}</SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="space-x-2">
          <Button
            disabled={selectedCourse === ''}
            onClick={() => {
              const selected = allCourses?.find(
                (course: Course) => course.id === selectedCourse
              );
              setCourses([...courses, selected]);
              setSelectedCourse('');
            }}
          >
            Add
          </Button>
          <Button className="bg-green-400" onClick={handleSubmit}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCourses;

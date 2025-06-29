import { Plus, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from './ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axiosClient';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
type FormInput = {
  departmentId: string;
  courseId: string;
  startTime: string;
  endTime: string;
  day: Date;
  venueId: string;
};

type DepartmentType = {
  id: string;
  name: string;
};
type CourseType = {
  id: string;
  title: string;
  code: string;
  desc: string;
};

type VenueType = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};
const ScheduleClass = () => {
  const {user} = useAuth()
  const { data: courses } = useQuery({
    queryKey: ['teachers-course'],
    queryFn: async () => {
      const resp = await api.get(`/teachers/${user?.id}/courses`);
      return resp.data.data;
    },
  });
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const resp = await api.get('/departments');
      return resp.data.data;
    },
  });
  const { data: venues } = useQuery({
    queryKey: ['all-venues'],
    queryFn: async () => {
      const resp = await api.get('/venues');
      return resp.data.data;
    },
  });

  const form = useForm({
    defaultValues: {
      departmentId: '',
      courseId: '',
      startTime: '08:00:00',
      endTime: '10:00:00',
      day: new Date(),
      venueId: '',
    },
  });

  const onSubmit = async (data: FormInput) => {
    try {
      const { day, startTime, endTime, venueId, courseId, departmentId } = data;
      const startDateTime = new Date(day);
      const endDateTime = new Date(day);

      const [startHours, startMinutes, startSeconds] = startTime.split(':');
      const [endHours, endMinutes, endSeconds] = endTime.split(':');

      startDateTime.setHours(
        Number(startHours),
        Number(startMinutes),
        Number(startSeconds)
      );
      endDateTime.setHours(
        Number(endHours),
        Number(endMinutes),
        Number(endSeconds)
      );

      const resp = await api.post('/classes', {
        courseId,
        venueId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        departmentId,
      });

      if (resp.status === 200) {
        toast.success('Class Schedule created successfully');
        form.reset();
        console.log('success');
      }
    } catch (error) {
      toast.error('Failed to create class schedule');
      console.log(error);
    }
  };
  return (
    <>
      <Drawer
        onOpenChange={(open) => {
          if (!open) form.reset();
        }}
      >
        <DrawerTrigger asChild>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Schedule a class
          </Button>
        </DrawerTrigger>
        <DrawerContent className="!max-h-dvh">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Add Class</DrawerTitle>
              <DrawerDescription>Create a class session</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  <FormField
                    control={form.control}
                    name="departmentId"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments &&
                              departments.map((item: DepartmentType) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courseId"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses &&
                              courses.map((item: CourseType) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.code} - {item.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="venueId"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {venues &&
                              venues.map((item: VenueType) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="day"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of class</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>{/* The Day th */}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startTime"
                      rules={{
                        required: {
                          message: 'Enter the start time',
                          value: true,
                        },
                        validate: (value) => {
                          const { endTime } = form.getValues();
                          // const today = new Date().
                          const end = new Date(`1970-01-01T${endTime}`);
                          const start = new Date(`1970-01-01T${value}`);

                          console.log('blah', end > start);
                          if (start >= end) {
                            return 'Start time must be before end time';
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Time</FormLabel>
                          <Input
                            type="time"
                            id="time"
                            step="1"
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            {...field}
                          />
                          <FormDescription>
                            When the class starts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      rules={{
                        required: {
                          message: 'Enter the end time',
                          value: true,
                        },
                        validate: (value) => {
                          const { startTime } = form.getValues();
                          // Convert both endTime and startTime to Date objects to compare
                          // Used 1970 because it still works even if I put the current date
                          const start = new Date(`1970-01-01T${startTime}`);
                          const end = new Date(`1970-01-01T${value}`);
                          if (end <= start) {
                            return 'End time must be after start time';
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Time</FormLabel>
                          <div className="flex flex-col gap-3">
                            <Input
                              type="time"
                              id="time"
                              step="1"
                              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              {...field}
                            />
                          </div>
                          <FormDescription>When the class ends</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">
                    Create <Plus />
                  </Button>
                </form>
              </Form>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ScheduleClass;

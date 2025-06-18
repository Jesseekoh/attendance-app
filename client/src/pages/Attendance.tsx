import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { api } from '../lib/axiosClient';
import ClassCard from '../components/ClassCard';
import { ClassInfoType } from '../components/RecentClasses';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
const Attendance = () => {
  const [items, setItems] = useState<ClassInfoType[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['attendance-data'],
    queryFn: async () => {
      const resp = await api.get('/classes/recent');
      return resp.data.data.recentClasses;
    },
  });

  useEffect(() => {
    if (data) {
      setItems(data);
      if (data.length === 0) {
        setHasMore(false);
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full"></div>
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return <h1>An error occurred.</h1>;
  }

  const fetchData = async () => {
    try {
      const resp = await api.get(
        `http://localhost:5000/api/v1/classes/recent?page=${page}`
      );
      const newItems = resp.data.data.recentClasses;
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
      if (newItems.length === 0) setHasMore(false);
    } catch (err) {
      console.error('Failed to fetch data', err);
      setHasMore(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <InfiniteScroll
        dataLength={items.length}
        hasMore={hasMore}
        next={fetchData}
        // style={{ display: 'grid', flexDirection: 'column', gap: '2rem' }}
        className="grid grid-col gap-4"
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <p className="text-muted-foreground">You've seen it all</p>
          </p>
        }
      >
        {items.map((item: ClassInfoType) => (
          <ClassCard classInfo={item} key={item.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Attendance;

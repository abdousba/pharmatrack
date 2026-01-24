import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 md:space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2"><Skeleton className="h-4 w-24" /></CardHeader><CardContent className="p-3 pt-2"><Skeleton className="h-8 w-12" /><Skeleton className="h-3 w-full mt-1" /></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2"><Skeleton className="h-4 w-24" /></CardHeader><CardContent className="p-3 pt-2"><Skeleton className="h-8 w-12" /><Skeleton className="h-3 w-full mt-1" /></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2"><Skeleton className="h-4 w-24" /></CardHeader><CardContent className="p-3 pt-2"><Skeleton className="h-8 w-12" /><Skeleton className="h-3 w-full mt-1" /></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2"><Skeleton className="h-4 w-24" /></CardHeader><CardContent className="p-3 pt-2"><Skeleton className="h-8 w-12" /><Skeleton className="h-3 w-full mt-1" /></CardContent></Card>
      </div>
    </div>
  )
}

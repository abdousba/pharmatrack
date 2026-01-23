'use client';

import dynamic from 'next/dynamic'
import { DashboardSkeleton } from './skeleton';

const DashboardClientPage = dynamic(() => import('./client'), { 
    ssr: false,
    loading: () => <DashboardSkeleton />
});

export default function DashboardPage() {
    return <DashboardClientPage />;
}

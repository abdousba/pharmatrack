'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { Service, Distribution } from '@/lib/types';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const AnalyticsCharts = dynamic(() => import('./charts'), {
    ssr: false,
    loading: () => <ChartsSkeleton />,
});

function ChartsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Aperçu de la distribution par Service</CardTitle>
                    <CardDescription>
                        Quantité totale de médicaments distribués par service.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full flex items-center justify-center sm:h-[300px]">
                        <Skeleton className="h-full w-full" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Top 5 des médicaments</CardTitle>
                    <CardDescription>Les plus distribués</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full h-[250px]" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function AnalyticsPage() {
  const { firestore, isUserLoading: isAuthLoading } = useFirebase();

  const servicesQuery = useMemoFirebase(() => (firestore && !isAuthLoading) ? collection(firestore, 'services') : null, [firestore, isAuthLoading]);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesQuery);

  const distributionsQuery = useMemoFirebase(() => (firestore && !isAuthLoading) ? collection(firestore, 'distributions') : null, [firestore, isAuthLoading]);
  const { data: distributions, isLoading: distributionsLoading } = useCollection<Distribution>(distributionsQuery);
  
  const isLoading = servicesLoading || distributionsLoading || isAuthLoading;

  return (
    <div className="space-y-4 md:space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Analyses et Rapports</CardTitle>
          <CardDescription>
            Visualisations détaillées des données de distribution de la pharmacie.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {isLoading ? (
        <ChartsSkeleton />
      ) : (
        <AnalyticsCharts services={services || []} distributions={distributions || []} />
      )}
    </div>
  );
}

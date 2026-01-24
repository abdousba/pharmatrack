'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMemo } from 'react';
import type { Drug, Distribution } from '@/lib/types';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';
import { DashboardSkeleton } from './skeleton';


export default function DashboardClientPage() {
  const { firestore, isUserLoading: isAuthLoading } = useFirebase();

  const drugsQuery = useMemoFirebase(() => (firestore && !isAuthLoading) ? collection(firestore, 'drugs') : null, [firestore, isAuthLoading]);
  const { data: drugs, isLoading: drugsLoading } = useCollection<Drug>(drugsQuery);

  const distributionsQuery = useMemoFirebase(() => (firestore && !isAuthLoading) ? collection(firestore, 'distributions') : null, [firestore, isAuthLoading]);
  const { data: distributions, isLoading: distributionsLoading } = useCollection<Distribution>(distributionsQuery);
  
  const isLoading = drugsLoading || distributionsLoading || isAuthLoading;

  const totalDrugs = drugs?.length ?? 0;
  const lowStockItems = useMemo(() => drugs?.filter(d => d.currentStock < d.lowStockThreshold).length ?? 0, [drugs]);
  const nearingExpiryItems = useMemo(() => {
    if (!drugs) return 0;
    const today = new Date();
    const next3Months = new Date();
    next3Months.setMonth(today.getMonth() + 3);
    return drugs.filter(d => {
      if (!d.expiryDate || d.expiryDate === 'N/A') return false;
      try {
        const expiryDate = new Date(d.expiryDate);
        return expiryDate > today && expiryDate <= next3Months;
      } catch {
        return false;
      }
    }).length;
  }, [drugs]);
  
  const recentDistributions = useMemo(() => {
     if (!distributions) return 0;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return distributions.filter(d => new Date(d.date) >= sevenDaysAgo).length;
  }, [distributions]);


  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
        <Link href="/inventory">
          <Card className="hover:border-primary/80 hover:bg-muted transition-all cursor-pointer active:scale-95">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-medium">Lots de médicaments</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="text-2xl font-bold">{totalDrugs}</div>
              <p className="text-xs text-muted-foreground">
                Lots de médicaments uniques
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?filter=low_stock">
          <Card className="hover:border-primary/80 hover:bg-muted transition-all cursor-pointer active:scale-95">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-medium">Articles en stock faible</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="text-2xl font-bold">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">
                Articles sous le seuil
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?filter=nearing_expiry">
          <Card className="hover:border-primary/80 hover:bg-muted transition-all cursor-pointer active:scale-95">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-medium">Proche de l'expiration</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="text-2xl font-bold">{nearingExpiryItems}</div>
              <p className="text-xs text-muted-foreground">
                Expire dans les 3 mois
              </p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-medium">Distributions récentes</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="text-2xl font-bold">+{recentDistributions}</div>
            <p className="text-xs text-muted-foreground">
              Pendant 7 derniers jours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

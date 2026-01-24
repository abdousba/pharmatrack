'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Service, Distribution } from '@/lib/types';

interface AnalyticsChartsProps {
    services: Service[];
    distributions: Distribution[];
}

export default function AnalyticsCharts({ services, distributions }: AnalyticsChartsProps) {

  const distributionByService = useMemo(() => {
    if (!services || !distributions) return []; 
    const serviceCounts: { [key: string]: number } = {};
    for (const service of services) {
      serviceCounts[service.name] = 0;
    }
    for (const dist of distributions) {
      const serviceName = services.find(s => s.id === dist.serviceId)?.name || dist.service;
      if (serviceName in serviceCounts) {
        serviceCounts[serviceName] += dist.quantityDistributed;
      } else {
        serviceCounts[serviceName] = dist.quantityDistributed;
      }
    }
    return Object.entries(serviceCounts)
      .map(([name, total]) => ({ name, total }))
      .filter(item => item.total > 0)
      .sort((a,b) => b.total - a.total);
  }, [services, distributions]);

  const topDistributedDrugs = useMemo(() => {
    if (!distributions) return []; 
    
    const drugCounts: { [name: string]: number } = {};

    for (const dist of distributions) {
        drugCounts[dist.itemName] = (drugCounts[dist.itemName] || 0) + dist.quantityDistributed;
    }

    return Object.entries(drugCounts)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
  }, [distributions]);

  const PASTEL_COLORS = [
    "hsl(12, 100%, 85%)",   // Light Salmon (Warmest)
    "hsl(30, 100%, 85%)",   // Light Orange
    "hsl(50, 100%, 85%)",   // Light Yellow
    "hsl(140, 80%, 85%)",  // Light Green
    "hsl(200, 100%, 85%)",  // Light Blue (Coolest)
  ];

    return (
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Aperçu de la distribution par Service</CardTitle>
                <CardDescription>
                  Quantité totale de médicaments distribués par service.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 pr-6">
                {/* Desktop Chart */}
                <div className="hidden h-[300px] w-full sm:block">
                  <ChartContainer config={{}} className="h-full w-full">
                    <BarChart data={distributionByService} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} angle={-35} textAnchor="end" height={60} interval={0} />
                      <YAxis />
                      <Tooltip cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }} content={<ChartTooltipContent />} />
                      <Bar dataKey="total" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </div>
                {/* Mobile Chart */}
                <div className="h-[400px] w-full sm:hidden">
                  <ChartContainer config={{}} className="h-full w-full">
                      <BarChart data={distributionByService} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={5} width={80} interval={0} />
                          <Tooltip cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }} content={<ChartTooltipContent />} />
                          <Bar dataKey="total" fill="hsl(var(--primary))" radius={4} />
                      </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Top 5 des médicaments</CardTitle>
                    <CardDescription>Les plus distribués</CardDescription>
                </CardHeader>
                <CardContent className="pl-2 pr-6">
                    {topDistributedDrugs.length > 0 ? (
                      <div className="h-[250px] w-full">
                        <ChartContainer config={{}} className="h-full w-full">
                            <BarChart data={topDistributedDrugs} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={5} width={100} interval={0} tick={{ fontSize: 12 }}/>
                                <Tooltip cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }} content={<ChartTooltipContent />} />
                                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                                    {topDistributedDrugs.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
                        Aucune donnée de distribution pour le moment.
                      </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

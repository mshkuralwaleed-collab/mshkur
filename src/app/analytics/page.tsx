'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '@/components/layout/header';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';
import { useUser, useCollection, useFirestore, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase/provider'; // Renamed to avoid conflict
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Eye, Share2, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useMemo } from 'react';
import type { Analytics, MonthlyAnalytics } from '@/lib/types';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { format, getMonth } from 'date-fns';


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.59,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );

export default function AnalyticsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  
  const analyticsQuery = user
    ? query(collection(firestore, 'users', user.uid, 'analytics'))
    : null;
    
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useCollection<Analytics>(analyticsQuery);

  useEffect(() => {
    const seedData = async () => {
        if (firestore && user) {
            const seeded = sessionStorage.getItem(`analytics_seeded_${user.uid}`);
            if (!seeded) {
                const now = new Date();
                const sampleEvents: Omit<Analytics, 'id'>[] = [
                    { eventType: 'cardView', timestamp: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), 1)) },
                    { eventType: 'share', timestamp: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), 5)) },
                    { eventType: 'cardView', timestamp: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth() - 1, 3)) },
                ];

                const analyticsCollection = collection(firestore, 'users', user.uid, 'analytics');
                sampleEvents.forEach(event => {
                    addDocumentNonBlocking(analyticsCollection, event);
                });
                
                sessionStorage.setItem(`analytics_seeded_${user.uid}`, 'true');
            }
        }
    };
    if (!isUserLoading && user) {
      seedData();
    }
  }, [firestore, user, isUserLoading]);

  const { monthlyData, totalViews, totalShares } = useMemo(() => {
    if (!analyticsData) {
      return { monthlyData: [], totalViews: 0, totalShares: 0 };
    }

    const totals = {
      totalViews: analyticsData.filter(a => a.eventType === 'cardView').length,
      totalShares: analyticsData.filter(a => a.eventType === 'share').length,
    }

    const groupedData: MonthlyAnalytics[] = Array.from({ length: 12 }, (_, i) => ({
      name: format(new Date(0, i), 'MMM'),
      views: 0,
      shares: 0,
    }));

    analyticsData.forEach(event => {
      const date = (event.timestamp as Timestamp).toDate();
      const monthIndex = getMonth(date);
      if (event.eventType === 'cardView') {
        groupedData[monthIndex].views++;
      } else if (event.eventType === 'share') {
        groupedData[monthIndex].shares++;
      }
    });

    return { monthlyData: groupedData, ...totals };
  }, [analyticsData]);


  const handleSignIn = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    }
  };

  const isLoading = isUserLoading || (user && isAnalyticsLoading);

  const renderContent = () => {
    if (isLoading) {
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
             <div className="lg:col-span-4 md:col-span-2">
                <Skeleton className="h-80 w-full" />
             </div>
          </div>
        );
      }
  
      if (!user) {
        return (
          <div className="text-center py-12">
            <p className="text-lg mb-4">{t['sign-in-to-view-rewards']?.replace('rewards', 'analytics')}</p>
            <Button onClick={handleSignIn} size="lg">
              <GoogleIcon className="mr-2 -ml-1" />
              {t['sign-in-with-google']}
            </Button>
          </div>
        );
      }

      return(
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Card Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total views all time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Card Shares</CardTitle>
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalShares.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total shares all time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">K-Factor</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.5</div>
                        <p className="text-xs text-muted-foreground">Viral Growth Metric</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Engagement Overview</CardTitle>
                    <CardDescription>A chart showing card views and shares over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="hsl(var(--primary))" />
                        <Bar dataKey="shares" fill="hsl(var(--accent))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
      )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Analytics Dashboard
          </h1>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

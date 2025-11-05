'use client';

import { useCollection, useUser } from '@/firebase';
import { useFirestore, useAuth } from '@/firebase/provider';
import { collection, query } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { RewardCard } from '@/components/rewards/reward-card';
import type { Reward } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

export default function RewardsPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { language } = useLanguage();
  const t = translations[language];

  const rewardsQuery = user ? query(collection(firestore, 'rewards')) : null;
  const { data: rewards, isLoading: isRewardsLoading } = useCollection<Reward>(rewardsQuery);
  
  useEffect(() => {
    const seedData = async () => {
        if (firestore) {
            const rewardImage = PlaceHolderImages.find(p => p.id === 'reward-1');
            if (rewardImage) {
                const sampleReward: Omit<Reward, 'id'> = {
                    name: 'Exclusive Template Pack',
                    description: 'Unlock a set of 5 premium, designer-made card templates.',
                    pointsCost: 250,
                    imageUrl: rewardImage.imageUrl,
                };
                
                const seeded = sessionStorage.getItem('rewards_seeded');
                if (!seeded) {
                     addDocumentNonBlocking(collection(firestore, 'rewards'), sampleReward);
                     sessionStorage.setItem('rewards_seeded', 'true');
                }
            }
        }
    };
    seedData();
  }, [firestore]);
  
  const handleSignIn = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    }
  };
  
  const isLoading = isUserLoading || (user && isRewardsLoading);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center py-12">
          <p className="text-lg mb-4">{t['sign-in-to-view-rewards']}</p>
          <Button onClick={handleSignIn} size="lg">
            <GoogleIcon className="mr-2 -ml-1" />
            {t['sign-in-with-google']}
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rewards?.map(reward => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
        {!isLoading && rewards?.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>{t['no-rewards-message']}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            {t['rewards-title']}
          </h1>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

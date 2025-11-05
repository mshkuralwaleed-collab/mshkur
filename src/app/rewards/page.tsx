'use client';

import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { RewardCard } from '@/components/rewards/reward-card';
import type { Reward } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { addDocumentNonBlocking } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function RewardsPage() {
  const firestore = useFirestore();
  const { language } = useLanguage();
  const t = translations[language];

  const rewardsQuery = query(collection(firestore, 'rewards'));
  const { data: rewards, isLoading } = useCollection<Reward>(rewardsQuery);
  
  useEffect(() => {
    // This is a one-time operation to seed initial data for demonstration.
    // In a real app, this would be managed by an admin panel.
    const seedData = async () => {
        const rewardImage = PlaceHolderImages.find(p => p.id === 'reward-1');
        if (rewardImage) {
            const sampleReward: Omit<Reward, 'id'> = {
                name: 'Exclusive Template Pack',
                description: 'Unlock a set of 5 premium, designer-made card templates.',
                pointsCost: 250,
                imageUrl: rewardImage.imageUrl,
            };
            
            // A simple check to prevent re-seeding on every page load in development
            const seeded = sessionStorage.getItem('rewards_seeded');
            if (!seeded && firestore) {
                 addDocumentNonBlocking(collection(firestore, 'rewards'), sampleReward);
                 sessionStorage.setItem('rewards_seeded', 'true');
            }
        }
    };
    seedData();
  }, [firestore]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            {t['rewards-title']}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            {rewards?.map(reward => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
          {!isLoading && rewards?.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p>{t['no-rewards-message']}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

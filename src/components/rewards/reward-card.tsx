'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Reward } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';

interface RewardCardProps {
  reward: Reward;
}

export function RewardCard({ reward }: RewardCardProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative w-full h-40">
        <Image
          src={reward.imageUrl}
          alt={reward.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{reward.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-muted-foreground mb-4">
          {reward.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-base">
            {reward.pointsCost} {t['points-label']}
          </Badge>
          <Button>{t['redeem-button']}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

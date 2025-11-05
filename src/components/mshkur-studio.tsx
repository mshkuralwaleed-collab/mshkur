'use client';

import { useState } from 'react';
import type { CardData } from '@/lib/types';
import ControlPanel from '@/components/studio/control-panel';
import CardPreview from '@/components/studio/card-preview';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';

export default function MshkurStudio() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'avatar-1');
  const { language } = useLanguage();
  const t = translations[language];

  const [cardData, setCardData] = useState<CardData>({
    name: t['card-name'],
    title: t['card-title'],
    contact: {
      email: 'hello@example.com',
      phone: '+1 234 567 890',
      website: 'aistudio.com',
    },
    bio: t['card-bio'],
    skills: [
      'AI/ML',
      'UI/UX Design',
      'Next.js',
      'GenAI',
      'Creative Direction',
    ],
    logoUrl: '',
    backgroundUrl: '',
    avatarUrl: userAvatar?.imageUrl || '',
  });

  return (
    <div
      className="container mx-auto p-4 md:p-8"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-8">
        <div className="lg:col-span-3">
          <CardPreview cardData={cardData} />
        </div>
        <div className="lg:col-span-2">
          <ControlPanel cardData={cardData} setCardData={setCardData} />
        </div>
      </div>
    </div>
  );
}

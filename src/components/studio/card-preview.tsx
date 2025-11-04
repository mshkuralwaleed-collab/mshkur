'use client';

import type { CardData } from '@/lib/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AtSign,
  Globe,
  Mail,
  Phone,
  Save,
  Share2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type CardPreviewProps = {
  cardData: CardData;
};

export default function CardPreview({ cardData }: CardPreviewProps) {
  return (
    <div className="sticky top-20">
      <Card className="overflow-hidden shadow-2xl shadow-primary/10">
        <div className="relative aspect-[9/16] w-full">
          {cardData.backgroundUrl ? (
            <video
              src={cardData.backgroundUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute h-full w-full object-cover"
              key={cardData.backgroundUrl}
            />
          ) : (
            <div className="absolute h-full w-full bg-gradient-to-br from-gray-900 to-background"></div>
          )}

          <div className="absolute inset-0 bg-black/40"></div>

          <CardContent className="relative z-10 flex h-full flex-col justify-between p-6 text-white md:p-8">
            <div className="flex items-start justify-between">
              {cardData.logoUrl ? (
                <Image
                  src={cardData.logoUrl}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="h-14 w-auto object-contain md:h-20"
                  data-ai-hint="logo"
                />
              ) : (
                <div className="h-14 w-14 md:h-20 md:w-20"></div>
              )}
               <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20">
                    <Share2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20">
                    <Save className="h-4 w-4" />
                </Button>
            </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-white/80 shadow-lg md:h-28 md:w-28">
                <AvatarImage src={cardData.avatarUrl} data-ai-hint="person portrait"/>
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight md:text-4xl">
                {cardData.name}
              </h1>
              <h2 className="mt-1 text-lg font-medium text-primary md:text-xl">
                {cardData.title}
              </h2>
              <p className="mt-4 max-w-sm text-sm text-white/80">
                {cardData.bio}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {cardData.skills.slice(0, 5).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="border-transparent bg-white/10 text-white backdrop-blur-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

               <Separator className="bg-white/20" />

              <div className="flex items-center justify-center gap-4 text-sm">
                {cardData.contact.email && (
                  <a href={`mailto:${cardData.contact.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" /> 
                  </a>
                )}
                 {cardData.contact.phone && (
                  <a href={`tel:${cardData.contact.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" /> 
                  </a>
                )}
                {cardData.contact.website && (
                  <a href={`https://${cardData.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Globe className="h-4 w-4" /> 
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

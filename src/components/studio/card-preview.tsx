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
  MessageCircle,
  Phone,
  Save,
  Share2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ChatbotSheet from './chatbot-sheet';
import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


type CardPreviewProps = {
  cardData: CardData;
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);


export default function CardPreview({ cardData }: CardPreviewProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleWhatsAppShare = () => {
    const cardUrl = window.location.href;
    const message = encodeURIComponent(
      `${t['whatsapp-share-message']}\n\n${cardUrl}`
    );
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSaveContact = () => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${cardData.name}`,
      `TITLE:${cardData.title}`,
      `EMAIL:${cardData.contact.email}`,
      `TEL;TYPE=CELL:${cardData.contact.phone}`,
      `URL:${cardData.contact.website}`,
      `NOTE:${cardData.bio}`,
      'END:VCARD',
    ].join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${cardData.name.replace(/\s/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
    <div className="sticky top-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="overflow-hidden shadow-lg w-full max-w-md mx-auto aspect-[9/16] max-h-[85vh]">
        <div className="relative h-full w-full">
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

          <CardContent className="relative z-10 flex h-full flex-col justify-between p-6 text-white overflow-y-auto">
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
               <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20" onClick={() => setIsChatbotOpen(true)}>
                        <MessageCircle className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t['chatbot-title']}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20" onClick={handleWhatsAppShare}>
                          <WhatsAppIcon className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on WhatsApp</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20 hover:bg-white/20" onClick={handleSaveContact}>
                          <Save className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save Contact</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
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
    <ChatbotSheet 
        isOpen={isChatbotOpen}
        setIsOpen={setIsChatbotOpen}
        cardData={cardData}
      />
    </>
  );
}

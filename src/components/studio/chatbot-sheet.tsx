'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, User, Bot } from 'lucide-react';
import type { CardData } from '@/lib/types';
import { chatbot } from '@/ai/flows/chatbot-flow';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

type ChatbotSheetProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cardData: CardData;
};

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatbotSheet({
  isOpen,
  setIsOpen,
  cardData,
}: ChatbotSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const { language } = useLanguage();
  const t = translations[language];
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);


  const handleSendMessage = () => {
    if (!query.trim()) return;

    const userMessage: Message = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');

    startTransition(async () => {
      try {
        const result = await chatbot({
          cardData: JSON.stringify(cardData),
          query,
        });
        const botMessage: Message = { sender: 'bot', text: result.response };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Chatbot Error:', error);
        const errorMessage: Message = {
          sender: 'bot',
          text: t['chatbot-error'],
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>{t['chatbot-title']}</SheetTitle>
          <SheetDescription>{t['chatbot-desc']}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-4 -mr-6" ref={scrollAreaRef} viewportRef={viewportRef}>
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.sender === 'user' ? 'justify-end' : ''
                )}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-lg p-3 text-sm max-w-xs',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.text}
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isPending && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className='rounded-lg p-3 text-sm bg-muted flex items-center'
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2 pt-2">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t['chatbot-placeholder']}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            disabled={isPending}
          />
          <Button onClick={handleSendMessage} disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

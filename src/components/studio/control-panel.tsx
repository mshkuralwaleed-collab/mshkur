'use client';

import React, { useState, useTransition } from 'react';
import type { CardData } from '@/lib/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Film,
  Image as ImageIcon,
  Loader2,
  Palette,
  ScanLine,
  Sparkles,
  Upload,
} from 'lucide-react';
import { aiCopilotInitialCardCreation } from '@/ai/flows/ai-copilot-initial-card-creation';
import { dataExtractionAndBioGeneration } from '@/ai/flows/data-extraction-bio-generation';
import { generateAndEnhanceLogo } from '@/ai/flows/ai-logo-generation-enhancement';
import { generate3DBackground } from '@/ai/flows/dynamic-3d-background-generation';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/locales';

type ControlPanelProps = {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
};

export default function ControlPanel({
  cardData,
  setCardData,
}: ControlPanelProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm({ defaultValues: cardData });
  const ocrForm = useForm<{ prompt: string; photoDataUri: string }>();
  const [extractedText, setExtractedText] = useState('');
  const { language } = useLanguage();
  const t = translations[language];

  const handleAIError = (feature: string, error: any) => {
    console.error(`${feature} Error:`, error);
    toast({
      variant: 'destructive',
      title: `AI Error: ${feature}`,
      description:
        'Something went wrong. Please check the console and try again.',
    });
  };

  const onCopilotSubmit = (data: { prompt: string }) => {
    startTransition(async () => {
      try {
        const result = await aiCopilotInitialCardCreation({
          prompt: data.prompt,
        });
        const parsedData = JSON.parse(result.cardData);
        setCardData(prev => ({
          ...prev,
          ...parsedData,
          skills: parsedData.skills || [],
        }));
        form.reset({
          ...cardData,
          ...parsedData,
          skills: parsedData.skills || [],
        });
        toast({
          title: t['ai-copilot-success-title'],
          description: t['ai-copilot-success-desc'],
        });
      } catch (error) {
        handleAIError('Copilot', error);
      }
    });
  };

  const handleOcrSubmit = () => {
    const photoDataUri = ocrForm.getValues('photoDataUri');
    if (!photoDataUri) {
      toast({
        variant: 'destructive',
        title: t['no-image-title'],
        description: t['no-image-desc'],
      });
      return;
    }
    startTransition(async () => {
      try {
        const { extractedData, bio } = await dataExtractionAndBioGeneration({
          photoDataUri,
        });
        setExtractedText(extractedData);
        setCardData(prev => ({ ...prev, bio }));
        form.setValue('bio', bio);
        toast({
          title: t['ocr-success-title'],
          description: t['ocr-success-desc'],
        });
      } catch (error) {
        handleAIError('OCR', error);
      }
    });
  };

  const onLogoSubmit = (data: {
    brandName: string;
    logoStyle: string;
    logoColors: string;
  }) => {
    startTransition(async () => {
      try {
        const { enhancedLogo } = await generateAndEnhanceLogo(data);
        setCardData(prev => ({ ...prev, logoUrl: enhancedLogo }));
        toast({
          title: t['logo-generated-title'],
          description: t['logo-generated-desc'],
        });
      } catch (error) {
        handleAIError('Logo Generation', error);
      }
    });
  };

  const onBackgroundSubmit = (data: { prompt: string }) => {
    startTransition(async () => {
      try {
        const { videoDataUri } = await generate3DBackground(data);
        setCardData(prev => ({ ...prev, backgroundUrl: videoDataUri }));
        toast({
          title: t['background-generated-title'],
          description: t['background-generated-desc'],
        });
      } catch (error) {
        handleAIError('Background Generation', error);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        ocrForm.setValue('photoDataUri', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t['ai-studio']}</CardTitle>
        <CardDescription>{t['ai-studio-desc']}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="copilot">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="copilot">
              <Bot className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="details">
              <ScanLine className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="logo">
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="background">
              <Film className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* AI Copilot Tab */}
          <TabsContent value="copilot">
            <Form {...useForm<{ prompt: string }>()}>
              <form
                onSubmit={useForm<{ prompt: string }>().handleSubmit(
                  onCopilotSubmit
                )}
                className="space-y-4 pt-4"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t['copilot-prompt-label']}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t['copilot-prompt-placeholder']}
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {t['generate-with-ai']}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Details & OCR Tab */}
          <TabsContent value="details">
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="ocr-file">{t['ocr-label']}</Label>
                <div className="flex gap-2">
                  <Input
                    id="ocr-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-grow"
                  />
                  <Button
                    onClick={handleOcrSubmit}
                    disabled={isPending}
                    variant="secondary"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {extractedText && (
                <Textarea
                  value={extractedText}
                  readOnly
                  rows={5}
                  placeholder={t['ocr-placeholder']}
                />
              )}
            </div>
          </TabsContent>

          {/* Logo Tab */}
          <TabsContent value="logo">
            <Form
              {...useForm({
                defaultValues: {
                  brandName: cardData.name,
                  logoStyle: 'minimalist',
                  logoColors: 'blue and white',
                },
              })}
            >
              <form
                onSubmit={useForm<{
                  brandName: string;
                  logoStyle: string;
                  logoColors: string;
                }>().handleSubmit(onLogoSubmit)}
                className="space-y-4 pt-4"
              >
                <FormField
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t['brand-name-label']}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="logoStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t['logo-style-label']}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t['logo-style-placeholder']}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="logoColors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t['logo-colors-label']}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t['logo-colors-placeholder']}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="mr-2 h-4 w-4" />
                  )}
                  {t['generate-logo-button']}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Background Tab */}
          <TabsContent value="background">
            <Form {...useForm<{ prompt: string }>()}>
              <form
                onSubmit={useForm<{ prompt: string }>().handleSubmit(
                  onBackgroundSubmit
                )}
                className="space-y-4 pt-4"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t['background-prompt-label']}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t['background-prompt-placeholder']}
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {t['generate-background-button']}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

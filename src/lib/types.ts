export type CardData = {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  bio: string;
  skills: string[];
  logoUrl: string;
  backgroundUrl: string;
  avatarUrl: string;
};

export type Language = 'en' | 'ar';

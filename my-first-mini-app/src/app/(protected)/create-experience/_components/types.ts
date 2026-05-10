export interface CreateFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  duration: string;
  maxGuests: string;
  price: string;
  coverImage: string;
  agreed: boolean;
}

export type ButtonState = 'pending' | 'success' | 'failed' | undefined;

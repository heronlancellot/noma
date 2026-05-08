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
}

export type ButtonState = 'pending' | 'success' | 'failed' | undefined;
export type FormErrors = Partial<Record<keyof CreateFormData, string>>;
export type InputChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

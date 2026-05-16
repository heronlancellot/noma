export interface ExperienceDetailData {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  rating: number;
  ratingCount: number;
  images: string[];
  creator: string;
  organizer: {
    name: string;
    peopleMet: number;
  };
}

export interface ExperienceConfirmationData {
  id: string;
  title: string;
  location: string;
  startTime?: bigint;
  image: string;
}

export interface JoinRequest {
  address: string;
  status: 'pending' | 'approved';
}

export type Organizer = {
  id: string;
  name: string;
  photoUrl: string;
};

export type FeedEvent = {
  id: string;
  title: string;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  date: string;
  photoUrl: string;
  isPublic: boolean;
  isBoosted: boolean;
  organizer: Organizer;
};

export type CurrentUser = {
  id: string;
  phone: string;
  name: string;
  about: string;
  photoUrl: string;
  isBoosted: boolean;
};

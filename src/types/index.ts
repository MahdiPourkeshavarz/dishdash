export type SatisfactionStatus = "awesome" | "good" | "bad" | "disgusted";

export interface User {
  id: string | null;
  username: string | null;
  image?: string | null;
}

export interface Post {
  _id?: string;
  id?: string;
  position: [number, number];
  satisfaction: SatisfactionStatus;
  user?: {
    id: string;
    username: string;
    imgUrl: string;
  };
  description: string;
  imageUrl: string;
  source?: "user" | "poi";
  areaName?: string;
  likes?: number;
  dislikes?: number;
  userId?: string;
  placeId: string;
  place: Partial<Poi>;
  createdAt: Date;
}

export interface Poi {
  _id?: string;
  name?: string;
  id: number;
  lat: number;
  lon: number;
  position?: [number, number];
  osmId?: number;
  averageRating?: number;
  ratingCount?: number;
  tags: {
    [key: string]: string | undefined;
    name?: string;
    amenity?: string;
    cuisine?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    "addr:street"?: string;
  };
}

export interface SearchParams {
  searchTerm: string;
  atmosphere: string;
  amenity: string;
  distance: "walking" | "near" | "driving";
}

export type MessageSender = "user" | "bot";

export interface ChatMessage {
  sender: MessageSender;
  text: string;
  places?: Poi[];
}

export type SatisfactionStatus = "awesome" | "good" | "bad";

export interface User {
  id: string | null;
  username: string | null;
  image?: string | null;
}

export interface Post {
  _id?: string;
  id: string;
  position: [number, number];
  satisfaction: SatisfactionStatus;
  user: {
    id: string;
    username: string;
    imgUrl: string;
  };
  description: string;
  imageUrl: string;
  source?: "user" | "poi";
  areaName?: string;
  like?: number;
  dislike?: number;
  userId?: string;
}

export interface Poi {
  _id?: number;
  id: number;
  lat: number;
  lon: number;
  position?: [number, number];
  osmId?: number;
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

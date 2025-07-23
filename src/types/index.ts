export type SatisfactionStatus = "awesome" | "good" | "bad";

export interface User {
  id: string;
  username: string;
  imgUrl: string;
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

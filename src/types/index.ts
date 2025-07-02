export type SatisfactionStatus = "awesome" | "good" | "bad";

export interface Post {
  id: number;
  position: [number, number];
  satisfaction: SatisfactionStatus;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
}

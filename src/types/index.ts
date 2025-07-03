export type SatisfactionStatus = "awesome" | "good" | "bad";

export interface Post {
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
}

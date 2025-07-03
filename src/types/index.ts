export type SatisfactionStatus = "awesome" | "good" | "bad";

export interface User {
  id: string;
  username: string;
  imgUrl: string;
}

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

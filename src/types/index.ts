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

export interface FoodTruck extends Partial<Poi> {
  carType?: string;
  isTodayAvailable?: boolean;
}

export const FoodTruckData: FoodTruck[] = [
  {
    _id: "ft1_ahmohsen_001",
    id: 1,
    name: "عمو محسن",
    lat: 35.7008,
    lon: 51.3912,
    position: [35.7008, 51.3912],
    averageRating: 4.2,
    ratingCount: 34,
    tags: {
      amenity: "food_truck",
      cuisine: "ساندویچ، چای، قهوه، سیب‌زمینی",
      phone: "09124567832",
      opening_hours: "6 pm - 2 am",
    },
  },
  {
    _id: "ft2_ghahvehkhane_002",
    id: 2,
    name: "قهوه‌خانه سیار رضایی",
    lat: 35.7153,
    lon: 51.4158,
    position: [35.7153, 51.4158],
    averageRating: 3.8,
    ratingCount: 19,
    tags: {
      amenity: "food_truck",
      cuisine: "چای، قهوه، دمنوش، کلوچه",
      phone: "09351234566",
      opening_hours: "4 pm - 12 am",
    },
  },
  {
    _id: "ft3_lavashak_003",
    id: 3,
    name: "فودتراک کوروش",
    lat: 35.7441,
    lon: 51.3385,
    position: [35.7441, 51.3385],
    averageRating: 4.5,
    ratingCount: 51,
    tags: {
      amenity: "food_truck",
      cuisine: "برگر، هات‌داگ، نوشابه، سالاد",
      phone: "09201112233",
      opening_hours: "5 pm - 1 am",
    },
  },
  {
    _id: "ft4_jigar_004",
    id: 4,
    name: "جگری علی‌اکبر",
    lat: 35.6866,
    lon: 51.4744,
    position: [35.6866, 51.4744],
    averageRating: 4.0,
    ratingCount: 27,
    tags: {
      amenity: "food_truck",
      cuisine: "جیگر، دل، قلوه، نوشابه",
      phone: "09127778899",
      opening_hours: "7 pm - 3 am",
    },
  },
  {
    _id: "ft5_ashghal_005",
    id: 5,
    name: "آش و حلیم نادر",
    lat: 35.7301,
    lon: 51.4487,
    position: [35.7301, 51.4487],
    averageRating: 4.7,
    ratingCount: 61,
    tags: {
      amenity: "food_truck",
      cuisine: "آش رشته، حلیم، شله‌زرد، چای",
      phone: "09381110022",
      opening_hours: "6 am - 12 pm",
    },
  },
  {
    _id: "ft6_pizza_mobile_006",
    id: 6,
    name: "پیتزا موبایل شاهین",
    lat: 35.7605,
    lon: 51.3801,
    position: [35.7605, 51.3801],
    averageRating: 3.6,
    ratingCount: 16,
    tags: {
      amenity: "food_truck",
      cuisine: "پیتزا تنوری، پیتزا مخلوط، نوشیدنی",
      phone: "09135554477",
      opening_hours: "6 pm - 1 am",
    },
  },
  {
    _id: "ft7_sibzamini_007",
    id: 7,
    name: "سیب‌زمینی محمود",
    lat: 35.6784,
    lon: 51.3692,
    position: [35.6784, 51.3692],
    averageRating: 4.3,
    ratingCount: 29,
    tags: {
      amenity: "food_truck",
      cuisine: "سیب‌زمینی سرخ‌کرده، سوسیس بندری، نوشابه",
      phone: "09023334455",
      opening_hours: "5 pm - 12 am",
    },
  },
  {
    _id: "ft8_kabab_mobile_008",
    id: 8,
    name: "کبابی سیار شاندیز",
    lat: 35.7992,
    lon: 51.4279,
    position: [35.7992, 51.4279],
    averageRating: 4.1,
    ratingCount: 42,
    tags: {
      amenity: "food_truck",
      cuisine: "کوبیده، جوجه، نوشابه، سالاد",
      phone: "09120098877",
      opening_hours: "1 pm - 10 pm",
    },
  },
  {
    _id: "ft9_falafel_009",
    id: 9,
    name: "فلافل آبادان",
    lat: 35.6829,
    lon: 51.4213,
    position: [35.6829, 51.4213],
    averageRating: 3.9,
    ratingCount: 23,
    tags: {
      amenity: "food_truck",
      cuisine: "فلافل، سمبوسه، لیمونات، چای",
      phone: "09350012244",
      opening_hours: "4 pm - 1 am",
    },
  },
  {
    _id: "ft10_cafe_van_010",
    id: 10,
    name: "کافه‌ون نیاوران",
    lat: 35.8167,
    lon: 51.4671,
    position: [35.8167, 51.4671],
    averageRating: 4.8,
    ratingCount: 74,
    tags: {
      amenity: "food_truck",
      cuisine: "قهوه، کیک، کوکی، نوشیدنی سرد",
      phone: "09220099011",
      opening_hours: "10 am - 10 pm",
    },
  },
];


export enum UserRole {
  USER = 'USER',
  HEALER = 'HEALER'
}

export enum SessionType {
  VIDEO = 'VIDEO',
  VOICE = 'VOICE',
  TEXT = 'TEXT'
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  timestamp: number;
  healerName?: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface Healer {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  fullBio: string;
  rating: number;
  reviewsCount: number;
  pricePerMinute: number;
  isOnline: boolean;
  avatar: string;
  gallery: string[];
  introVideo?: string;
  categories: string[];
  location: string;
  languages: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  walletBalance: number;
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

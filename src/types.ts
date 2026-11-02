export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  userLiked?: boolean;
}

export interface Author {
  name: string;
  handle: string;
  avatar: string;
  followersCount: number;
  isFollowing?: boolean;
}

export interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  aspectRatio: '3:4' | '4:3' | '1:1' | '16:9' | '9:16';
  category: string;
  author: Author;
  savesCount: number;
  likesCount: number;
  isSaved?: boolean;
  isLiked?: boolean;
  savedInBoardId?: string;
  sourceUrl?: string;
  tags: string[];
  createdAt: string;
  comments: Comment[];
}

export interface Board {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  coverImage?: string;
  createdAt: string;
  pinIds: string[];
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  email?: string;
  followersCount: number;
  followingCount: number;
  website?: string;
  location?: string;
}

export interface DonationConfig {
  adminEmail: string;
  upiId: string;
  payeeName: string;
  defaultAmount: number;
  message: string;
  isActive: boolean;
}

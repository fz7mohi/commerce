// Define shared types for SocioPe features

export type SocialPost = {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  content: string;
  images: string[];
  products: string[];
  likes: Like[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
};

export type Like = {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
};

export type Comment = {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SociopeReport = {
  id: string;
  type: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  reporterId: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SociopeSettings = {
  id: string;
  autoModKeywords: string[];
  userPostLimit: number;
  imageRequired: boolean;
  productRequired: boolean;
  updatedAt: Date;
};

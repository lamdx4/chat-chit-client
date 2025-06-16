// src/types/story.model.ts

export interface Story {
  storyId: number;
  ownerId: number;
  content: string;
  type: "image" | "video";
  text?: string;
  visibility: number;
  createdAt: Date; 
}

export interface StoryUser {
  userId: number;
  userName: string;
  avatar: string | null;
  lastStoryTime: string;
  isViewed: boolean;
}

export interface StoryItem {
  storyId: number;
  type: "image" | "video";
  content: string;
  text?: string;
  createdAt: string;
  isViewed: boolean;
  isReacted: boolean;
}

export interface StoryUserWithItems {
  userId: number;
  userName: string;
  avatar: string | null;
  isViewed: boolean;
  stories: StoryItem[];
}

export interface StoryWithUser {
  storyId: number;
  type: "image" | "video";
  content: string;
  text?: string;
  createdAt: string;
  isViewed: boolean;
  visibility: number;
  isReacted: boolean;
  user: {
    userId: number;
    userName: string;
    avatar: string | null;
    isFriend: boolean;
  };
}


export interface StoryReaction {
  userId: number;
  userName: string;
  avatar: string | null;
  isReacted: boolean;
}
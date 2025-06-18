import { axios_auth } from "@/config/axios-auth";
import { Story, StoryReaction, StoryUser, StoryUserWithItems, StoryWithUser, UserStoryArchived} from "@/types/story";
import { ResponseData } from "@/types/response.types";


export async function createStory({
  file,
  text,
  visibility,
}: {
  file: File;
  text?: string;
  visibility?: number;
}): Promise<Story | null> {
  const formData = new FormData();
  formData.append("file", file);
  if (text) formData.append("text", text);
  formData.append("visibility", String(visibility ?? 0));

  try {
    const res = await axios_auth.post<ResponseData<Story>>("/story", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getFriendsStories(): Promise<StoryUser[]> {
  try {
    const res = await axios_auth.get<ResponseData<StoryUser[]>>("/story/friends");
    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getFriendsStoriesList(): Promise<StoryUserWithItems[]> {
  try {
    const res = await axios_auth.get<ResponseData<StoryUserWithItems[]>>("/story/friends/list");
    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function viewStory(storyId: number): Promise<boolean> {
  try {
    await axios_auth.post(`/story/${storyId}/view`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getUserStories(userId?: number): Promise<StoryUserWithItems | null> {
  try {
    const endpoint = userId ? `/story/user/${userId}` : '/story/user/c';
    const res = await axios_auth.get<ResponseData<StoryUserWithItems>>(endpoint);
    return res.data.data ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export async function getRecentStories(): Promise<StoryWithUser[]> {
  try {
    const res = await axios_auth.get<ResponseData<StoryWithUser[]>>("/story/recent");
    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function reactToStory(storyId: number): Promise<boolean> {
  try {
    await axios_auth.post(`/story/${storyId}/react`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


export async function getStoryInteractions(storyId: number): Promise<StoryReaction[]> {
  try {
    const res = await axios_auth.get<ResponseData<StoryReaction[]>>(`/story/${storyId}/interactions`);
    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}


export async function getArchivedStories(userId?: number): Promise<UserStoryArchived | null> {
  try {
    const endpoint = userId ? `/story/archived/${userId}` : '/story/archived/c';
    const res = await axios_auth.get<ResponseData<UserStoryArchived>>(endpoint);
    return res.data.data ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export async function archiveStory(storyId: number, status: boolean): Promise<boolean> {
  try {
    await axios_auth.patch(`/story/${storyId}/archive`, { status });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteStory(storyId: number): Promise<boolean> {
  try {
    await axios_auth.delete(`/story/${storyId}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
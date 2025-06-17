import { ArrowLeft, Camera, Settings, Plus, Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StoryList } from "../elements/story-list";
import { StoryWithUser } from "@/types/story";
import { getRecentStories } from "@/services/story.service";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoryViewer } from "../elements/story-viewer";
import { StoryUserWithItems } from "@/types/story";
import useAuth from "@/hooks/use-auth";
import { useNavigate } from "react-router";

export default function StoryPage() {
  const [recentStories, setRecentStories] = useState<StoryWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<StoryUserWithItems | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"All Stories" | "Friends">("All Stories");
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentStories = async () => {
      try {
        const stories = await getRecentStories();
        setRecentStories(stories);
      } catch (error) {
        console.error("Failed to fetch recent stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentStories();
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const storyTime = new Date(timestamp);
    const adjustedStoryTime = new Date(storyTime.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours
    const diffInMs = now.getTime() - adjustedStoryTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours >= 24) return "24h";
    if (diffInHours < 1) return `${diffInMinutes}m`;
    return `${diffInHours}h`;
  };

  const handleStoryClick = (story: StoryWithUser) => {
    // Convert StoryWithUser to StoryUserWithItems format
    const storyUserWithItems: StoryUserWithItems = {
      userId: story.user.userId,
      userName: story.user.userName,
      avatar: story.user.avatar,
      isViewed: story.isViewed,
      stories: [
        {
          storyId: story.storyId,
          type: story.type,
          content: story.content,
          text: story.text,
          createdAt: story.createdAt,
          isViewed: story.isViewed,
          isReacted: story.isReacted,
        }
      ]
    };
    
    setSelectedStory(storyUserWithItems);
    setShowViewer(true);
  };

  const closeViewer = () => {
    setShowViewer(false);
    setSelectedStory(null);
  };

  const handleArchiveClick = () => {
    if (auth.user?.userName) {
      navigate(`/u/profile/${auth.user.userName}`);
    }
  };

  // Filter stories based on selected category
  const filteredStories = recentStories.filter(story => {
    if (selectedFilter === "Friends") {
      return story.user.isFriend === true; // Friends only stories
    }
    return true; // All stories
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Layout */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Share your moments with friends
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search stories..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Story
                </Button>
                <Button variant="ghost" size="icon">
                  <Camera className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Stories</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Story
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={handleArchiveClick}
                  >
                    <Camera className="h-4 w-4" />
                    Archive
                  </Button>
                </div>

                <Separator className="my-4" />

                <h4 className="font-medium mb-3 text-sm text-gray-600">
                  Categories
                </h4>
                <div className="space-y-2">
                  {["All Stories", "Friends"].map(
                    (category) => (
                      <Button
                        key={category}
                        variant={selectedFilter === category ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => setSelectedFilter(category as "All Stories" | "Friends")}
                      >
                        {category}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stories Content */}
          <div className="lg:col-span-3">
            {/* Your Stories Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Stories</h2>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                <StoryList />
              </CardContent>
            </Card>

            {/* Recent Stories Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Recent Stories</h2>
                </div>

                {/* Stories Grid */}
                {loading ? (
                  <div className="text-center py-12">
                    <p>Loading stories...</p>
                  </div>
                ) : filteredStories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredStories.map((story) => (
                      <Card
                        key={story.storyId}
                        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleStoryClick(story)}
                      >
                        <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                          {story.type === "image" ? (
                            <img
                              src={story.content}
                              alt="Story"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <video
                                src={story.content}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="bg-black/60 rounded-full p-3">
                                  <Play className="h-8 w-8 text-white fill-white" />
                                </div>
                              </div>
                            </div>
                          )}
                          {story.text && (
                            <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded backdrop-blur-sm">
                              <p className="line-clamp-2">{story.text}</p>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage
                                src={story.user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {story.user.userName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">
                                {story.user.userName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTimeAgo(story.createdAt)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      {selectedFilter === "Friends" ? "No friends stories" : "No recent stories"}
                    </p>
                    <p className="text-sm">
                      {selectedFilter === "Friends" 
                        ? "No stories from friends available" 
                        : "Check back later for new stories from your friends"
                      }
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Story Viewer */}
      {showViewer && selectedStory && (
        <StoryViewer
          stories={[selectedStory]}
          initialUserIndex={0}
          initialStoryIndex={0}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}

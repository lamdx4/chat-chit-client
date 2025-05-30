import { ArrowLeft, Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryList } from "../elements/story-list";

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Stories</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Camera className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        <StoryList />

        {/* Recent Stories Section */}
        <div className="mt-8">
          <h3 className="text-md font-medium mb-4 text-gray-700">Recent</h3>
          <div className="space-y-3">
            {/* You can add more story-related content here */}
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No more stories to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

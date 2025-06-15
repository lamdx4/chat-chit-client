import { ArrowLeft, Camera, Settings, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StoryList } from "../elements/story-list";

export default function StoryPage() {

  
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
                  {["All Stories", "Friends", "Close Friends", "Following"].map(
                    (category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm"
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                    <Button variant="ghost" size="sm">
                      Sort
                    </Button>
                  </div>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* Placeholder story cards */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                              Story {i + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">User {i + 1}</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Empty State */}
                <div className="text-center py-12 text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No more stories</p>
                  <p className="text-sm">
                    Check back later for new stories from your friends
                  </p>
                  <Button variant="outline" className="mt-4">
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

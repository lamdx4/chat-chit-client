import { useState } from "react";
import {
  Search,
  UserPlus,
  UserCheck,
  X,
  Check,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for the friends page
const friendRequests = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    mutualFriends: 5,
    time: "2 days ago",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Trần Thị B",
    mutualFriends: 12,
    time: "1 week ago",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Lê Văn C",
    mutualFriends: 3,
    time: "3 days ago",
    avatar: "/placeholder.svg",
  },
];

const currentFriends = [
  { id: 8, name: "Đặng Thị H", mutualFriends: 25, avatar: "/placeholder.svg" },
  { id: 9, name: "Mai Văn I", mutualFriends: 11, avatar: "/placeholder.svg" },
  {
    id: 10,
    name: "Trương Thị K",
    mutualFriends: 9,
    avatar: "/placeholder.svg",
  },
  { id: 11, name: "Lý Văn L", mutualFriends: 14, avatar: "/placeholder.svg" },
  { id: 12, name: "Đinh Thị M", mutualFriends: 17, avatar: "/placeholder.svg" },
  { id: 13, name: "Trịnh Văn N", mutualFriends: 6, avatar: "/placeholder.svg" },
];

export default function FriendsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="py-6 w-full bg-white rounded-xl h-full shadow-sm px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Friends</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search friends"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:space-x-2">
            <TabsTrigger value="requests" className="flex gap-2 items-center">
              <UserPlus className="h-4 w-4" />
              Friend Requests
              <Badge variant="secondary" className="ml-1">
                {friendRequests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex gap-2 items-center">
              <UserCheck className="h-4 w-4" />
              All Friends
              <Badge variant="secondary" className="ml-1">
                {currentFriends.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Friend Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <h2 className="text-lg font-medium mb-4">Friend Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friendRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback>
                          {request.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <h3 className="font-medium">{request.name}</h3>
                          <p className="text-sm text-gray-500">
                            {request.mutualFriends} mutual friends
                          </p>
                          <p className="text-xs text-gray-400">
                            {request.time}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button className="w-full bg-blue-500 hover:bg-blue-600">
                              <Check className="mr-1 h-4 w-4" /> Accept
                            </Button>
                            <Button variant="outline" className="w-full">
                              <X className="mr-1 h-4 w-4" /> Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* All Friends Tab */}
          <TabsContent value="friends" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                All Friends ({currentFriends.length})
              </h2>
              <Button variant="outline">
                <Search className="mr-1 h-4 w-4" /> Find Friends
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentFriends.map((friend) => (
                <Card key={friend.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{friend.name}</h3>
                        <p className="text-sm text-gray-500">
                          {friend.mutualFriends} mutual friends
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Birthdays Tab */}
        </Tabs>
      </div>
    </div>
  );
}

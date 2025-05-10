import { useState } from "react";
import { Search, UserPlus, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FriendRequestsTab } from "../elements/friend-request-tab";
import { FriendsTab } from "../elements/friend-tab";
import { SentRequestsTab } from "../elements/sent-request-tab";
import { Button } from "../ui/button";

export default function FriendsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="py-6 w-full bg-white rounded-xl min-h-full shadow-sm px-6">
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
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex md:space-x-2">
            <TabsTrigger value="requests" className="flex gap-2 items-center">
              <UserPlus className="h-4 w-4" />
              Friend Requests
              <Badge variant="secondary" className="ml-1">
                {/* {friendRequests.data?.pages[0]?.requests.length || 0} */}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="friends" className="flex gap-2 items-center">
              <UserCheck className="h-4 w-4" />
              All Friends
              <Badge variant="secondary" className="ml-1">
                {/* {friends.data?.pages[0]?.friends.length || 0} */}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="sent-requests"
              className="flex gap-2 items-center"
            >
              <UserCheck className="h-4 w-4" />
              Sent Requests
              <Badge variant="secondary" className="ml-1">
                {/* {sentRequests.data?.pages[0]?.data.length || 0} */}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Friend Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <h2 className="text-lg font-medium mb-4">Friend Requests</h2>
            <FriendRequestsTab />
          </TabsContent>

          {/* All Friends Tab */}
          <TabsContent value="friends" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                {/* All Friends ({friends.data?.pages.flatMap(p => p.friends).length || 0}) */}
              </h2>
              <Button variant="outline">
                <Search className="mr-1 h-4 w-4" /> Find Friends
              </Button>
            </div>
            <FriendsTab />
          </TabsContent>

          {/* Sent Requests Tab */}
          <TabsContent value="sent-requests" className="mt-6">
            <h2 className="text-lg font-medium mb-4">Sent Requests</h2>
            <SentRequestsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

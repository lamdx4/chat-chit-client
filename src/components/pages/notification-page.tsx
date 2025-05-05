import { useState } from "react"
import {
  Bell,
  Settings,
  UserPlus,
  Heart,
  MessageSquare,
  Tag,
  Calendar,
  Check,
  MoreHorizontal,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: "friend_request",
    user: { name: "Nguyễn Văn A", avatar: "/placeholder.svg" },
    content: "sent you a friend request",
    time: "2 minutes ago",
    isRead: false,
    actions: ["accept", "decline"],
  },
  {
    id: 2,
    type: "like",
    user: { name: "Trần Thị B", avatar: "/placeholder.svg" },
    content: "liked your photo",
    postPreview: "/placeholder.svg",
    time: "15 minutes ago",
    isRead: false,
  },
  {
    id: 3,
    type: "comment",
    user: { name: "Lê Văn C", avatar: "/placeholder.svg" },
    content: 'commented on your post: "Thật tuyệt vời!"',
    time: "1 hour ago",
    isRead: true,
  },
  {
    id: 4,
    type: "tag",
    user: { name: "Phạm Thị D", avatar: "/placeholder.svg" },
    content: "tagged you in a photo",
    postPreview: "/placeholder.svg",
    time: "3 hours ago",
    isRead: true,
  },
  {
    id: 5,
    type: "birthday",
    user: { name: "Hoàng Văn E", avatar: "/placeholder.svg" },
    content: "has a birthday today",
    time: "5 hours ago",
    isRead: true,
    actions: ["send_wishes"],
  },
  {
    id: 6,
    type: "friend_accepted",
    user: { name: "Ngô Thị F", avatar: "/placeholder.svg" },
    content: "accepted your friend request",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: 7,
    type: "comment",
    user: { name: "Vũ Văn G", avatar: "/placeholder.svg" },
    content: 'replied to your comment: "Cảm ơn bạn rất nhiều!"',
    time: "2 days ago",
    isRead: true,
  },
  {
    id: 8,
    type: "event",
    user: { name: "Đặng Thị H", avatar: "/placeholder.svg" },
    content: 'invited you to an event: "Họp lớp cuối năm"',
    time: "3 days ago",
    isRead: true,
    actions: ["respond"],
  },
]

export default function NotificationPage() {
  const [notificationList, setNotificationList] = useState(notifications)

  const unreadCount = notificationList.filter((n) => !n.isRead).length

  const markAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, isRead: true })))
  }

  const markAsRead = (id : number) => {
    setNotificationList(notificationList.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const getNotificationIcon = (type : string) => {
    switch (type) {
      case "friend_request":
      case "friend_accepted":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "tag":
        return <Tag className="h-4 w-4 text-purple-500" />
      case "birthday":
        return <Calendar className="h-4 w-4 text-yellow-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="py-6 w-full bg-white rounded-xl h-full shadow-sm px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="mr-1 h-4 w-4" /> Mark all as read
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All notifications</DropdownMenuItem>
                <DropdownMenuItem>Unread only</DropdownMenuItem>
                <DropdownMenuItem>Friend requests</DropdownMenuItem>
                <DropdownMenuItem>Comments</DropdownMenuItem>
                <DropdownMenuItem>Tags</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="flex gap-2 items-center">
              <Bell className="h-4 w-4" />
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex gap-2 items-center">
              <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex gap-2 items-center">
              <UserPlus className="h-4 w-4" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex gap-2 items-center">
              <Tag className="h-4 w-4" />
              Mentions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {notificationList.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${!notification.isRead ? "bg-blue-50" : ""} transition-colors`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between">
                            <p className="text-sm">
                              <span className="font-medium">{notification.user.name}</span> {notification.content}
                            </p>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
                          </div>

                          {notification.postPreview && (
                            <div className="mt-2">
                              <img
                                src={notification.postPreview || "/placeholder.svg"}
                                alt="Post preview"
                                className="h-16 w-16 object-cover rounded-md"
                              />
                            </div>
                          )}

                          {notification.actions && (
                            <div className="flex gap-2 mt-3">
                              {notification.actions.includes("accept") && (
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                  Accept
                                </Button>
                              )}
                              {notification.actions.includes("decline") && (
                                <Button size="sm" variant="outline">
                                  Decline
                                </Button>
                              )}
                              {notification.actions.includes("send_wishes") && (
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                  Send Wishes
                                </Button>
                              )}
                              {notification.actions.includes("respond") && (
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                  Respond
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="mt-6">
            <div className="space-y-4">
              {notificationList.filter((n) => !n.isRead).length > 0 ? (
                notificationList
                  .filter((n) => !n.isRead)
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className="bg-blue-50 transition-colors"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <div className="flex items-start justify-between">
                                <p className="text-sm">
                                  <span className="font-medium">{notification.user.name}</span> {notification.content}
                                </p>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                  {notification.time}
                                </span>
                              </div>

                              {notification.postPreview && (
                                <div className="mt-2">
                                  <img
                                    src={notification.postPreview || "/placeholder.svg"}
                                    alt="Post preview"
                                    className="h-16 w-16 object-cover rounded-md"
                                  />
                                </div>
                              )}

                              {notification.actions && (
                                <div className="flex gap-2 mt-3">
                                  {notification.actions.includes("accept") && (
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                      Accept
                                    </Button>
                                  )}
                                  {notification.actions.includes("decline") && (
                                    <Button size="sm" variant="outline">
                                      Decline
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No unread notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            <div className="space-y-4">
              {notificationList.filter((n) => n.type === "friend_request" || n.type === "friend_accepted").length >
              0 ? (
                notificationList
                  .filter((n) => n.type === "friend_request" || n.type === "friend_accepted")
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`${!notification.isRead ? "bg-blue-50" : ""} transition-colors`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
                              <UserPlus className="h-4 w-4 text-blue-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <div className="flex items-start justify-between">
                                <p className="text-sm">
                                  <span className="font-medium">{notification.user.name}</span> {notification.content}
                                </p>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                  {notification.time}
                                </span>
                              </div>

                              {notification.actions && (
                                <div className="flex gap-2 mt-3">
                                  {notification.actions.includes("accept") && (
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                      Accept
                                    </Button>
                                  )}
                                  {notification.actions.includes("decline") && (
                                    <Button size="sm" variant="outline">
                                      Decline
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <UserPlus className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No friend notifications</p>
                  <p className="text-sm">You don't have any friend activity right now</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mentions" className="mt-6">
            <div className="space-y-4">
              {notificationList.filter((n) => n.type === "tag").length > 0 ? (
                notificationList
                  .filter((n) => n.type === "tag")
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`${!notification.isRead ? "bg-blue-50" : ""} transition-colors`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
                              <Tag className="h-4 w-4 text-purple-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <div className="flex items-start justify-between">
                                <p className="text-sm">
                                  <span className="font-medium">{notification.user.name}</span> {notification.content}
                                </p>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                  {notification.time}
                                </span>
                              </div>

                              {notification.postPreview && (
                                <div className="mt-2">
                                  <img
                                    src={notification.postPreview || "/placeholder.svg"}
                                    alt="Post preview"
                                    className="h-16 w-16 object-cover rounded-md"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Tag className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No mentions</p>
                  <p className="text-sm">You haven't been tagged in any posts recently</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

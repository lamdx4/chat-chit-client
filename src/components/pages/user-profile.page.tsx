import { MoreHorizontal, Users, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import userService from "@/services/user.service";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import NotFoundElement from "../elements/not-found.element";
import { SpinLoadingElement } from "../elements/spin-loading.element";
import useAuth from "@/hooks/use-auth";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import User from "@/types/user";
import getUrlFile from "@/utils/get-url-file";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userInformation, setUserInformation] = useState<User | null>(null);
  const [isUserNotFound, setIsUserNotFound] = useState(false);
  const auth = useAuth();
  const params = useParams();
  const userName = params.userName;

  const isOwnProfile = auth.user?.userName === userName;

  useEffect(() => {
    if (!userName) return;

    userService
      .getProfileByUserName(userName)
      .then((res) => {
        console.log(res);
        if (res.status === 404) {
          setIsUserNotFound(true);
        } else if (res.status === 200) {
          setUserInformation(res.data.data);
        }
      })
      .catch(() => {
        setIsUserNotFound(true);
      });
  }, [userName]);

  if (!userName) {
    return <NotFoundElement />;
  }

  return userInformation ? (
    <div className="flex-col mx-auto px-4 py-8 bg-white dark:bg-slate-900">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-center gap-17 mb-8">
        {/* Profile Picture */}
        <div className="relative w-35 h-35 md:w-35 md:h-35">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700">
            <div className="rounded-full bg-white p-0.5 h-full w-full">
              <Avatar className="h-full w-full rounded-full overflow-hidden">
                {userInformation.avatar ? (
                  <>
                    <AvatarImage
                      src={getUrlFile(userInformation.avatar) || undefined}
                      alt={userInformation.userName}
                      className="h-full w-full object-cover rounded-full"
                    />
                    <AvatarFallback className="rounded-full">
                      {userInformation.fullName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="rounded-full">
                    {userInformation.fullName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-xl font-normal">{userInformation.fullName}</h1>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate("/u/setting");
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="secondary">Message</Button>
                  <Button variant="secondary" size="icon">
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="underline font-bold italic">
              {"@" + userInformation.userName}
            </p>
            <p className="text-sm text-gray-500">
              {userInformation.bio || "No bio available"}
            </p>
            {/* Gender & Country */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Gender:</span>
                <span className="font-semibold">
                  {userInformation.gender || "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Country:</span>
                <span className="font-semibold">
                  {userInformation.country || "Not set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      {/* 
      Content Tabs
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-center">
          <TabsTrigger value="posts" className="flex-1">
            STORY
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square">
                <img
                  src="/placeholder.svg"
                  alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs> */}
    </div>
  ) : isUserNotFound ? (
    <NotFoundElement />
  ) : (
    <SpinLoadingElement />
  );
}

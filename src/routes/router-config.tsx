import MessageChat from "@/components/pages/message-chat.page";
import MainLayout from "@/components/layouts/main-layout";
import LoginPage from "@/components/pages/login.page";
import { Navigate, RouteObject } from "react-router";
import { ChatProvider } from "@/components/providers/chat-provider/chat-provider";
import ProtectedRouteNoAuth from "@/components/elements/protect-route-no-auth.element";
import ProtectedRouteAuth from "@/components/elements/protect-route-auth.element";
import UserProfile from "@/components/pages/user-profile.page";
import FriendsPage from "@/components/pages/friends.page";
import NotificationPage from "@/components/pages/notification-page";
import RegisterPage from "@/components/pages/register.page";
import ForgotPassword from "@/components/pages/forgot-password.page";
import OuterLayout from "@/components/layouts/x.layout";
import SettingPage from "@/components/pages/setting.page";
import LinkGoogleCallbackPage from "@/components/pages/link-sucess.page";

const appRouterConfig: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedRouteNoAuth element={<OuterLayout />} />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/u",
    element: (
      <ProtectedRouteAuth
        element={
          <ChatProvider>
            <MainLayout />
          </ChatProvider>
        }
      />
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/u/message" replace />,
      },
      {
        path: "message",
        element: <MessageChat />,
      },
      {
        path: "profile/:userName",
        element: <UserProfile />,
      },
      {
        path: "notification",
        element: <NotificationPage />,
      },
      {
        path: "friends",
        element: <FriendsPage />,
      },
      {
        path: "setting",
        element: <SettingPage />,
      },
      {
        path: "link-to-google",
        element: <LinkGoogleCallbackPage></LinkGoogleCallbackPage>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/u/message" replace />,
  },
];
export default appRouterConfig;

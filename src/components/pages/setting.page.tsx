import { CircleUser, Globe, UserLock, UserRoundCog } from "lucide-react";
import React, { useState } from "react";
import EditProfileTab from "../elements/edit-profile-tab.element";
import EditAccountInformation from "../elements/edit-account-information-tab";
import AccountPrivacy from "../elements/account-privacy-tab";
import BlockList from "../elements/block-list-tab";
import { useMutation } from "@tanstack/react-query";
import { axios_auth } from "@/config/axios-auth";
import User from "@/types/user";
import { SpinLoadingElement } from "../elements/spin-loading.element";
import { ResponseData } from "@/types/response.types";
import useAuth from "@/hooks/use-auth";

type TabKey =
  | "edit-profile"
  | "account"
  | "notifications"
  | "privacy"
  | "blocked";

const tabConfig: {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  section: "account" | "who-can-see" | "interact";
}[] = [
  {
    key: "edit-profile",
    label: "Basic Info",
    icon: <CircleUser className="w-5 h-5 mr-3" />,
    section: "account",
  },
  {
    key: "account",
    label: "Account Information",
    icon: <UserRoundCog className="w-5 h-5 mr-3" />,
    section: "account",
  },
  {
    key: "privacy",
    label: "Account privacy",
    icon: <Globe className="w-5 h-5 mr-3" />,
    section: "who-can-see",
  },
  {
    key: "blocked",
    label: "Blocked",
    icon: <UserLock className="w-5 h-5 mr-3" />,
    section: "who-can-see",
  },
];

const SettingPage = () => {
  const auth = useAuth();
  const user = auth.user!;
  const myDetailInformationMutate = useMutation({
    mutationFn: () => {
      return axios_auth.get<ResponseData<User>>("/user/my-profile");
    },
    onError(error) {
      console.log("Error fetching user profile:", error);
    },
    onSuccess(data) {
      if (data.status !== 200) {
        console.log("Error fetching user profile:", data);
        return;
      }
      auth.updateUser(data.data.data);
      console.log("User profile data:", data);
    },
  });

  const [activeTab, setActiveTab] = useState<TabKey>("edit-profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "edit-profile":
        return <EditProfileTab mutate={myDetailInformationMutate} />;
      case "account":
        return <EditAccountInformation mutate={myDetailInformationMutate} />;
      // case "notifications":
      //   return <NotificationsTab />;
      case "privacy":
        return <AccountPrivacy />;
      case "blocked":
        return <BlockList />;
      default:
        return <div className="text-red-500">Error: Unknown tab selected.</div>;
    }
  };

  // Group tabs by section
  const sections = {
    account: tabConfig.filter((t) => t.section === "account"),
    "who-can-see": tabConfig.filter((t) => t.section === "who-can-see"),
    interact: tabConfig.filter((t) => t.section === "interact"),
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      <div className="w-64 h-full border-r border-gray-200 bg-white p-6 overflow-y-auto">
        <h1 className="text-xl font-bold mb-6">Settings</h1>
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2">Account Setting</h3>
          <div className="space-y-2">
            {sections.account.map((tab) => (
              <div
                key={tab.key}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2">
            Who can see your content
          </h3>
          <div className="space-y-2">
            {sections["who-can-see"].map((tab) => (
              <div
                key={tab.key}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors 
                  duration-200 ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-2">
            How others can interact with you
          </h3>
          <div className="space-y-2">
            {sections.interact.map((tab) => (
              <div
                key={tab.key}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!user ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <SpinLoadingElement />
        </div>
      ) : (
        <div className="flex-1 p-6 overflow-y-auto">{renderTabContent()}</div>
      )}
    </div>
  );
};
export default React.memo(SettingPage);

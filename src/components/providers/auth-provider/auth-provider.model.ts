import User from "@/types/user";
import { AuthProviderProps, AuthProviderStore } from "./auth-provider.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { eventBus } from "@/utils/events";

function getSaveAuthData(): AuthProviderStore {
  const userJson = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");

  if (!userJson || !accessToken)
    return {
      isAuthenticated: false,
    };

  try {
    const usr = JSON.parse(userJson) as User;

    if (usr.userId) {
      return {
        isAuthenticated: true,
        accessToken: accessToken,
        user: usr,
      };
    }

    return {
      isAuthenticated: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }

  return {
    isAuthenticated: false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useAuthProviderModel(_props: AuthProviderProps) {
  const initalizedState = useRef<boolean>(false);
  const [store, setStore] = useState<AuthProviderStore>(getSaveAuthData());

  const authenticate = useCallback(
    (accessToken: string, user: User, refreshToken: string) => {
      setStore({
        isAuthenticated: true,
        user,
        accessToken: accessToken,
      });

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    []
  );

  const signout = useCallback(() => {
    setStore({
      isAuthenticated: false,
      user: undefined,
      accessToken: undefined,
    });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  useEffect(() => {
    if (!initalizedState.current) {
      initalizedState.current = true;

      const userJson = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (!userJson || !accessToken) return;

      try {
        const usr = JSON.parse(userJson) as User;

        if (usr.userId) {
          setStore({
            isAuthenticated: true,
            accessToken: accessToken,
            user: usr,
          });
        }
      } catch (e) {
        console.error(e);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }, [authenticate]);

  const updateUser = useCallback((user: User) => {
    setStore((prev) => ({
      ...prev,
      user,
    }));
    localStorage.setItem("user", JSON.stringify(user));
  }, []);
  
  const updateAccessToken = useCallback((accessToken: string) => {
    setStore((prev) => ({
      ...prev,
      accessToken,
    }));
    localStorage.setItem("accessToken", accessToken);
  }, []);

  useEffect(() => {
    // Khi token được refresh
    const tokenRefreshedUnsub = eventBus.subscribe(
      "auth:token-refreshed",
      (newToken: string) => {
        console.log("Token refreshed in hook:", newToken);
        updateAccessToken(newToken);
      }
    );

    // Khi logout
    const logoutUnsub = eventBus.subscribe("auth:logout", () => {
      console.log("Logout triggered in hook");
      signout();
    });

    return () => {
      tokenRefreshedUnsub();
      logoutUnsub();
    };
  }, []);

  return {
    store,
    authenticate,
    signout,
    updateAccessToken,
    updateUser,
  };
}

export default useAuthProviderModel;

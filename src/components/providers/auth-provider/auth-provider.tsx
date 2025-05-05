import AuthProviderContextProvider from "./auth-provider.context.tsx";
import useAuthProviderModel from "./auth-provider.model";
import { AuthProviderProps } from "./auth-provider.types.tsx";
import React from "react";

/**
 * `AuthProvider` is a React component that provides authentication context to its children.
 */
function AuthProvider(props: AuthProviderProps) {
  const { children } = props;

  const { authenticate, signout, store, updateAccessToken, updateUser } =
    useAuthProviderModel(props);

  return (
    <AuthProviderContextProvider
      value={{ authenticate, signout, updateAccessToken, updateUser, ...store }}
    >
      {children}
    </AuthProviderContextProvider>
  );
}

export default React.memo(AuthProvider);

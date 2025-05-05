// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appRouterConfig from "./routes/router-config";
import MyRoute from "@/lib/router/router";
import AppProvider from "./components/providers/app-provider/app-provider";
import { Toaster } from "sonner";
import { DialogGlobal } from "./components/elements/dialog.element";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <AppProvider>
        <MyRoute routes={appRouterConfig}></MyRoute>
      </AppProvider>
      <Toaster />
      <DialogGlobal />
    </QueryClientProvider>
  );
}

export default App;

import { PageContainer } from "./layouts/PageContainer";
import { ReactLocation, Router, Outlet, Navigate, Route } from "@tanstack/react-location";
import HomePage from "./pages/home-page";

const reactLocation = new ReactLocation();

const routes: Route[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/zustand",
    element: () => import("./pages/zustand-app").then((mod) => <mod.default />),
  },
  {
    path: "/jotai",
    element: () => import("./pages/jotai-app").then((mod) => <mod.default />),
  },
  {
    path: "/valtio",
    element: () => import("./pages/valtio-app").then((mod) => <mod.default />),
  },
  {
    path: "/subscribed",
    element: () => import("./pages/subscribed-app").then((mod) => <mod.default />),
  },
  {
    element: <Navigate to="/zustand" />,
  },
];

const App = () => {
  return (
    <Router location={reactLocation} routes={routes}>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </Router>
  );
};

export default App;

import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import Loader from "./context/Loader";
import _ from "lodash";
import { IRoutes } from "./types";
import { AppRoutes } from "./constants";

const SignIn = React.lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = React.lazy(() => import("./pages/AuthPages/SignUp"));
const UserProfiles = React.lazy(() => import("./pages/UserProfiles"));
const Videos = React.lazy(() => import("./pages/UiElements/Videos"));
const Images = React.lazy(() => import("./pages/UiElements/Images"));
const Alerts = React.lazy(() => import("./pages/UiElements/Alerts"));
const Badges = React.lazy(() => import("./pages/UiElements/Badges"));
const Avatars = React.lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = React.lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = React.lazy(() => import("./pages/Charts/LineChart"));
const BarChart = React.lazy(() => import("./pages/Charts/BarChart"));
 const BasicTables = React.lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = React.lazy(() => import("./pages/Forms/FormElements"));
const Blank = React.lazy(() => import("./pages/Blank"));
const AppLayout = React.lazy(() => import("./layout/AppLayout"));
const Home = React.lazy(() => import("./pages/Dashboard/Home"));
const Restaurants = React.lazy(() => import("./pages/Restaurants"));
const Branches = React.lazy(() => import("./pages/RBranches"));
const AddEditRBranch = React.lazy(
  () => import("./pages/RBranches/AddEditRBranch")
);
const AddEditRestaurant = React.lazy(
  () => import("./pages/Restaurants/AddEditRestaurant")
);

const PRIVATE_ROUTES: IRoutes[] = [
  {
    path: AppRoutes.DASHBOARD,
    element: <Home />,
  },
  {
    path: AppRoutes.PROFILE,
    element: <UserProfiles />,
  },
  {
    path: AppRoutes.RESTAURANTS,
    element: <Restaurants />,
  },
  {
    path: AppRoutes.BRANCHES,
    element: <Branches />,
  },
  {
    path: AppRoutes.ADD_RESTAURANT,
    element: <AddEditRestaurant />,
  },
  {
    path: AppRoutes.ADD_BRANCH,
    element: <AddEditRBranch />,
  },
  {
    path: "/blank",
    element: <Blank />,
  },
  {
    path: "/form-elements",
    element: <FormElements />,
  },
  {
    path: "/basic-tables",
    element: <BasicTables />,
  },
  {
    path: "/alerts",
    element: <Alerts />,
  },
  {
    path: "/avatars",
    element: <Avatars />,
  },
  {
    path: "/badges",
    element: <Badges />,
  },
  {
    path: "/buttons",
    element: <Buttons />,
  },
  {
    path: "/images",
    element: <Images />,
  },
  {
    path: "/videos",
    element: <Videos />,
  },
  {
    path: "/line-chart",
    element: <LineChart />,
  },
  {
    path: "/bar-chart",
    element: <BarChart />,
  },
];

const PUBLIC_ROUTES: IRoutes[] = [
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/user-profiles",
    element: <UserProfiles />,
  },
];

const RouterComponent = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<AppLayout />}>
          {_.map(PRIVATE_ROUTES, (route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
        </Route>
        {_.map(PUBLIC_ROUTES, (route, index) => {
          return (
            <Route path={route.path} key={index} element={route.element} />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;

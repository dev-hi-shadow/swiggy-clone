import React, { Suspense, useEffect } from "react";
import { matchPath, Route, Routes, useLocation, useNavigate } from "react-router";
import Loader from "./context/Loader";
import _ from "lodash";
import { IRoutes } from "./types";
import { AppRoutes, LanguagePreferences } from "./constants";
import i18n from "./i18n";

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
const SwitchRestaurant = React.lazy(() => import("./pages/SwitchRestaurant"));
const RBranches = React.lazy(() => import("./pages/RBranches"));
const Categories = React.lazy(() => import("./pages/Categories"));
const Roles = React.lazy(() => import("./pages/Roles"));
const AddEditRBranch = React.lazy(() => import("./pages/RBranches/AddEditRBranch"));
const AddEditRestaurant = React.lazy(() => import("./pages/Restaurants/AddEditRestaurant"));
const AddEditRole = React.lazy(() => import("./pages/Roles/AddEditRole"));
const AddEditCategory = React.lazy(
  () => import("./pages/Categories/AddEditCategory")
);

const PRIVATE_FULL_PAGE_ROUTES: IRoutes[] = [
  {
    path: AppRoutes.SWITCH_RESTAURANT,
    element: <SwitchRestaurant />,
  },
];

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
    path: AppRoutes.ADD_RESTAURANT,
    element: <AddEditRestaurant />,
  },
  {
    path: AppRoutes.EDIT_RESTAURANT,
    element: <AddEditRestaurant />,
  },
  {
    path: AppRoutes.ADD_BRANCH,
    element: <AddEditRBranch />,
  },
  {
    path: AppRoutes.CATEGORIES,
    element: <Categories />,
  },
  {
    path: AppRoutes.ADD_CATEGORY,
    element: <AddEditCategory />,
  },
  {
    path: AppRoutes.EDIT_CATEGORY,
    element: <AddEditCategory />,
  },
  {
    path: AppRoutes.ROLES,
    element: <Roles />,
  },
  {
    path: AppRoutes.ADD_ROLE,
    element: <AddEditRole />,
  },
  {
    path: AppRoutes.EDIT_ROLE,
    element: <AddEditRole />,
  },
  {
    path: AppRoutes.EDIT_BRANCH,
    element: <AddEditRBranch />,
  },
  {
    path: AppRoutes.BRANCHES,
    element: <RBranches />,
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

const { pathname } = useLocation(); 
const navigate = useNavigate();

  useEffect(() => {
    const isProtectedRoute = [
      ...PRIVATE_ROUTES,
      ...PRIVATE_FULL_PAGE_ROUTES,
    ].some((route) => matchPath({ path: route.path, end: false }, pathname));

    if (isProtectedRoute && !localStorage.getItem("authToken")) {
      navigate(AppRoutes.SIGN_IN, { replace: true });
    }
    i18n.changeLanguage(LanguagePreferences.EN);
  }, [navigate, pathname]);
  
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {_.map(PRIVATE_FULL_PAGE_ROUTES, (route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}
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

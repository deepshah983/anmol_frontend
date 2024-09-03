import React from "react";
import { Navigate } from "react-router-dom";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";


// // Profile
import UserProfile from "../pages/Authentication/user-profile";


// About
import Users from "../pages/Users/index";

// Tradingform
import Tradingform from "../pages/Tradingform/index";

// strategy
import Strategy from "../pages/Strategy/index";

// Order Log
import OrderLog from "../pages/OrderLog/index";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // About
  { path: "/users", component: <Users /> },
  //   // //profile
  { path: "/profile", component: <UserProfile /> },

   // Tradingform
   { path: "/trading-form", component: <Tradingform /> },

   // Strategy
   { path: "/strategy", component: <Strategy /> },

   // Order Log
   { path: "/order-log", component: <OrderLog /> },

  //this route should be at the end of all other routes | eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  {
    path: "/auth-two-step-verification-2",
    component: <TwostepVerification2 />,
  },
];

export { authProtectedRoutes, publicRoutes };

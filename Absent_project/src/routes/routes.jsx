import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { useUserName } from "../contexts/state/hooks";
import Protected from "./Protected";
import Absent from "../page/Absent";
import SignUp from "../page/SignUp";
import SignIn from "../page/SignIn";
import IndexPage from "../page/IndexPage";
import Test from "../page/Test";
import Test2 from "../page/Test2";
import Repost from "../page/Repost";
import Admin from "../page/Admin";
import Approved from "../page/Approved";
export default function Routes() {
  const user = useUserName();

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Protected isLoggedIn={user}>
          <IndexPage />
        </Protected>
      ),
      children: [
        { element: <Navigate to="/absent" />, index: true },
        {
          path: "absent",
          element: <Absent />,
        },
      ],
    },
    {
      path: "/Login",
      element: <SignIn />,
    },
    {
      path: "/Register",
      element: <SignUp />,
    },
    {
      path: "/Test",
      element: <Test />,
    },
    {
      path: "/Test2",
      element: <Test2 />,
    },
    {
      path: "/Repost",
      element: <Repost />,
    },
    {
      path: "/Admin",
      element: <Admin />,
    },
    {
      path: "/Approved",
      element: <Approved />,
    },
    // {
    //   path: "/Approved/:rowId/:name1/:typabsent",
    //   element: <Approved />,
    // },
    // {
    //   path: `/Approved?rowId&name1=&typabsent=&datillabsent=&startabsent=&endabsent=`,
    //   element: <Approved />,
    // },
  ]);
  return routes;
}

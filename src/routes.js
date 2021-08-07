/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import DailyStockList from "views/DailyStockList";
import UserPage from "views/UserPage.js";

import ProductDailyStock from "./views/ProductDailyStock";
import Payments from "views/Payments";
import Receipts from "views/Receipts";

var dashRoutes = [{
        path: "/dashboard",
        name: "Dashboard",
        icon: "design_app",
        component: Dashboard,
        layout: "/admin",
    },
    {
        path: "/daily-stocks",
        name: "Daily Stocks",
        icon: "business_chart-bar-32",
        component: DailyStockList,
        layout: "/admin",
    },
    {
        path: "/payments",
        name: "Payments",
        icon: "business_money-coins",
        component: Payments,
        layout: "/admin",
    },
    {
        path: "/reciepts",
        name: "Receipts",
        icon: "files_paper",
        component: Receipts,
        layout: "/admin",
    },
    // {
    //     path: "/reciept",
    //     name: "Receipts",
    //     icon: "files_paper",
    //     component: UserPage,
    //     layout: "/admin",
    // },
    // {
    //     path: "/user-page",
    //     name: "User Profile",
    //     icon: "users_single-02",
    //     component: UserPage,
    //     layout: "/admin",
    // },
    // {
    //     path: "/extended-tables",
    //     name: "Icons",
    //     icon: "files_paper",
    //     component: Icons,
    //     layout: "/admin",
    // },
    // {
    //     path: "/typography",
    //     name: "Typography",
    //     icon: "design-2_ruler-pencil",
    //     component: Notifications,
    //     layout: "/admin",
    // },
    {
        pro: true,
        path: "/logout",
        name: "LOG OUT",
        icon: "media-1_button-power",
        component: Dashboard,
        layout: "/admin",
    },
];

var routes = [{
    path: "/daily-stock/:product_uuid",
    component: ProductDailyStock,
    layout: "/admin"
}];

export { dashRoutes, routes };
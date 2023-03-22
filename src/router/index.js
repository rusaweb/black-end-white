import {createRouter, createWebHistory} from "vue-router";

import NProgress from "nprogress/nprogress.js";

// Main layouts
import LayoutDashboard from "@/layouts/DashboardLayout.vue";
import LayoutDashboardUser from "@/layouts/LayoutDashboardUser.vue";
import LayoutAuth from "@/layouts/AuthLayout.vue";
import {getCookie, setCookie} from "@/utils/cookie";
import {useUserStore} from "@/stores/dashboard/user/user";

const InfoOrder = () => import("@/views/confirm/Order.vue");
// Auth: Login
const Login = () => import("@/views/auth/SignIn.vue");

// Backend: Dashboard
const Dashboard = () => import("@/views/dashboard/Main.vue");
const DashboardUser = () => import("@/views/dashboard-user/Main.vue");
const OrderUserDetail = () => import("@/views/dashboard-user/order/Detail.vue");
const OrderIssueUserDetail = () => import("@/views/dashboard-user/order/IssueDetail.vue");
const Profile = () => import("@/views/dashboard/Profile.vue");
const ProfileUser = () => import("@/views/dashboard-user/Profile.vue");
const Leads = () => import("@/views/dashboard/lead/Leads.vue");
const ClientsOperator = () => import("@/views/dashboard/client/ClientsOperator.vue");
const ClientsEditOperator = () => import("@/views/dashboard/client/ClientsEditOperator.vue");
const ClientsAdministrator = () => import("@/views/dashboard/client/ClientsAdministrator.vue");
const ClientsEditAdministrator = () => import("@/views/dashboard/client/ClientsEditAdministrator.vue");
const Survey = () => import("@/views/dashboard/survey/Survey.vue");
const SurveyTechnologist = () => import("@/views/dashboard/survey/SurveyTechnologist.vue");
const Color = () => import("@/views/dashboard/settings/tags/Color.vue");
const Sex = () => import("@/views/dashboard/settings/tags/Sex.vue");
const Defect = () => import("@/views/dashboard/settings/tags/Defect.vue");
const Users = () => import("@/views/dashboard/users/Users.vue");
const StockAdministrator = () => import("@/views/dashboard/stock/StockAdministrator.vue");
const StockDetailAdministrator = () => import("@/views/dashboard/stock/StockDetailAdministrator.vue");
const StockTechnologist = () => import("@/views/dashboard/stock/StockTechnologist.vue");
const StockDetailTechnologist = () => import("@/views/dashboard/stock/StockDetailTechnologist.vue");
const Consumption = () => import("@/views/dashboard/consumption/Consumption.vue");
const OperatorOrders = () => import("@/views/dashboard/order/operator/OperatorOrders.vue");
const OperatorOrderDetail = () => import("@/views/dashboard/order/operator/OperatorOrderDetail.vue");
const OperatorOrderIssueDetail = () => import("@/views/dashboard/order/operator/OperatorOrderIssueDetail.vue");
const GetCourierOrders = () => import("@/views/dashboard/order/courier/GetCourierOrders.vue");
const PushCourierOrders = () => import("@/views/dashboard/order/courier/PushCourierOrders.vue");
const CourierOrderDetail = () => import("@/views/dashboard/order/courier/CourierOrderDetail.vue");
const TechnologistOrders = () => import("@/views/dashboard/order/technologist/TechnologistOrders.vue");
const TechnologistOrderDetail = () => import("@/views/dashboard/order/technologist/TechnologistOrderDetail.vue");
const SettingsOrderItemType = () => import("@/views/dashboard/settings/SettingsOrderItemType.vue");
const SettingsOrderItemStep = () => import("@/views/dashboard/settings/SettingsOrderItemStep.vue");
const SettingsOrderItemCategory = () => import("@/views/dashboard/settings/SettingsOrderItemCategory.vue");
const SettingsHangerCategory = () => import("@/views/dashboard/settings/Hanger/Category.vue");
const SettingsHangerList = () => import("@/views/dashboard/settings/Hanger/List.vue");
const SettingsTariffs = () => import("@/views/dashboard/settings/SettingsTariffs.vue");
const SettingsStatus = () => import("@/views/dashboard/settings/SettingsStatus.vue");
const SettingsMore = () => import("@/views/dashboard/settings/SettingsMore.vue");
const PromoCode = () => import("@/views/dashboard/promocode/List.vue");
const SpecialistsScanPage = () => import("@/views/dashboard/specialists/Scan.vue");
const SpecialistsOrderPage = () => import("@/views/dashboard/specialists/Order.vue");
const PackagerScanPage = () => import("@/views/dashboard/packager/Scan.vue");
const Analytics = () => import("@/views/dashboard/Analytics.vue");
const PackagerOrderPage = () => import("@/views/dashboard/packager/Order.vue");
const AdditionalProcessing = () => import("@/views/dashboard/settings/SettingsAdditionalProcessing.vue");
const AdditionalServices = () => import("@/views/dashboard/settings/SettingsAdditionalServices.vue");
const Accessory = () => import("@/views/dashboard/Accessory.vue");

// /order/S521071?t=iZ9f8%2BGyRkuhPKKR3RgJ2mGdAvH2f2nSWSg2rrNn
// Set all routes
const routes = [
    {
        path: "/order/:id",
        component: InfoOrder,
        name: 'order-confirm'
    },
    {
        path: "/auth",
        component: LayoutAuth,
        redirect: "/auth/login",
        children: [
            {
                path: "login",
                name: "login",
                component: Login,
            },
        ],
    },
    {
        path: "/user",
        component: LayoutDashboardUser,
        children: [
            {
                path: "",
                name: "user",
                component: DashboardUser,
                meta: {
                    auth: true
                }
            },
            {
                path: "profile",
                name: "profile-user",
                component: ProfileUser,
                meta: {
                    auth: true
                },
            },
            {
                path: "order/:id",
                name: "order-user-detail",
                component: OrderUserDetail,
                meta: {
                    auth: true
                },
            },
            {
                path: "order-issue/:order_id/:id",
                name: "order-issue-user-detail",
                component: OrderIssueUserDetail,
                meta: {
                    auth: true
                },
            },
        ]
    },
    {
        path: "/admin",
        component: LayoutDashboard,
        meta: {
            roles: ["COURIER", "PACKAGER", "ADMINISTRATOR", "TECHNOLOGIST", "OPERATOR"],
            auth: true
        },
        children: [
            {
                path: "",
                name: "admin",
                component: Dashboard,
                meta: {
                    roles: ["COURIER", "PACKAGER", "ADMINISTRATOR", "TECHNOLOGIST", "OPERATOR"],
                    auth: true
                },
            },
            {
                path: "profile",
                name: "profile",
                component: Profile,
                meta: {
                    auth: true
                }
            },
            {
                path: "leads",
                name: "leads",
                component: Leads,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "analytics",
                name: "analytics",
                component: Analytics,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "clients-operator",
                name: "clients-operator",
                component: ClientsOperator,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "clients-operator/:id",
                name: "clients-operator-edit",
                component: ClientsEditOperator,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "clients-administrator",
                name: "clients-administrator",
                component: ClientsAdministrator,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "clients-administrator/:id",
                name: "clients-administrator-edit",
                component: ClientsEditAdministrator,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "survey-technologist",
                name: "survey-technologist",
                component: SurveyTechnologist,
                meta: {
                    roles: ["ADMINISTRATOR", "TECHNOLOGIST"],
                    auth: true
                }
            },
            {
                path: "survey",
                name: "survey",
                component: Survey,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "tag-color",
                name: "tag-color",
                component: Color,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "tag-sex",
                name: "tag-sex",
                component: Sex,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "tag-defect",
                name: "tag-defect",
                component: Defect,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "users",
                name: "users",
                component: Users,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "stocks-administrator",
                name: "stocks-administrator",
                component: StockAdministrator,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "stocks-administrator/:id",
                name: "stocks-administrator-detail",
                component: StockDetailAdministrator,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "stocks-technologist",
                name: "stocks-technologist",
                component: StockTechnologist,
                meta: {
                    roles: ["ADMINISTRATOR", "TECHNOLOGIST"],
                    auth: true
                }
            },
            {
                path: "stocks-technologist/:id",
                name: "stocks-technologist-detail",
                component: StockDetailTechnologist,
                meta: {
                    roles: ["ADMINISTRATOR", "TECHNOLOGIST"],
                    auth: true
                }
            },
            {
                path: "consumption",
                name: "consumption",
                component: Consumption,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "order-operator",
                name: "order-operator",
                component: OperatorOrders,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "order-operator/:id",
                name: "order-operator-detail",
                component: OperatorOrderDetail,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "order-issue-operator/:order_id/:id",
                name: "order-issue-operator-detail",
                component: OperatorOrderIssueDetail,
                meta: {
                    roles: ["ADMINISTRATOR", "OPERATOR"],
                    auth: true
                }
            },
            {
                path: "order-courier",
                children: [
                    {
                        path: "get-order",
                        name: "get-order-courier",
                        component: GetCourierOrders,
                        meta: {
                            auth: true
                        }
                    },
                    {
                        path: "push-order",
                        name: "push-order-courier",
                        component: PushCourierOrders,
                        meta: {
                            auth: true
                        }
                    }
                ],
            },
            {
                path: "order-courier/:id",
                name: "order-courier-detail",
                component: CourierOrderDetail,
                meta: {
                    auth: true
                }
            },
            {
                path: "order-technologist",
                name: "order-technologist",
                component: TechnologistOrders,
                meta: {
                    auth: true
                }
            },
            {
                path: "order-technologist/:id",
                name: "order-technologist-detail",
                component: TechnologistOrderDetail,
                meta: {
                    auth: true
                }
            },
            {
                path: "promo-code",
                name: "promo-code",
                component: PromoCode,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "specialists",
                name: "specialists",
                component: SpecialistsScanPage,
                meta: {
                    roles: ["ADMINISTRATOR", "TECHNOLOGIST"],
                    auth: true
                }
            },
            {
                path: "specialists-order/:id",
                name: "specialists-order",
                component: SpecialistsOrderPage,
                meta: {
                    roles: ["ADMINISTRATOR", "TECHNOLOGIST"],
                    auth: true
                }
            },
            {
                path: "packager",
                name: "packager",
                component: PackagerScanPage,
                meta: {
                    roles: ["ADMINISTRATOR", "PACKAGER"],
                    auth: true
                }
            },
            {
                path: "packager-order/:id",
                name: "packager-order",
                component: PackagerOrderPage,
                meta: {
                    roles: ["ADMINISTRATOR", "PACKAGER"],
                    auth: true
                }
            },
            {
                path: "additional-processing",
                name: "additional-processing",
                component: AdditionalProcessing,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "additional-services",
                name: "additional-services",
                component: AdditionalServices,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "accessory",
                name: "accessory",
                component: Accessory,
                meta: {
                    roles: ["ADMINISTRATOR"],
                    auth: true
                }
            },
            {
                path: "settings",
                children: [
                    {
                        path: "order-item-step",
                        name: "order-item-step",
                        component: SettingsOrderItemStep,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                    {
                        path: "order-item-category",
                        name: "order-item-category",
                        component: SettingsOrderItemCategory,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                    {
                        path: "hanger-category",
                        name: "hanger-category",
                        component: SettingsHangerCategory,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                    {
                        path: "hanger-list",
                        name: "hanger-list",
                        component: SettingsHangerList,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                    {
                        path: "tariffs",
                        name: "tariffs",
                        component: SettingsTariffs,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                    {
                        path: "status",
                        name: "status",
                        component: SettingsStatus,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                    {
                        path: "more",
                        name: "more",
                        component: SettingsMore,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                    {
                        path: "order-item-type",
                        name: "order-item-type",
                        component: SettingsOrderItemType,
                        meta: {
                            roles: ["ADMINISTRATOR"],
                            auth: true
                        }
                    },
                ],
            },
        ],
    },
];
// process.env = {...process.env, ...loadEnv(mode, process.cwd())};
// Create Router
const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE),
    linkActiveClass: "active",
    linkExactActiveClass: "active",
    scrollBehavior() {
        return {left: 0, top: 0};
    },
    routes,
});

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({showSpinner: false});
const checkRoles = async () => {
    const store = useUserStore()
    if (!store.user && getCookie('access_token')) {
        try {
            await store.getUser()
        } catch (e) {
            await store.clearProfileInfo()
        }
    }
    return store.user
}
const checkAuth = async () => {
    let auth
    const store = useUserStore()
    if (!store.user && getCookie('access_token')) {
        try {
            await store.getUser()
        } catch (e) {
            console.log(e)
        }
    }
    auth = !!(store.user);
    return auth
}

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const requireAuth = to.matched.some(record => record.meta.auth)
    const parent = to.matched.at(0)
    const roles = to.meta.roles
    const token = encodeURIComponent(to?.query?.t)
    if (to?.query?.t) {
        setCookie('access_token', 'refresh', 99999)
        setCookie('refresh_token', token, 99999)
    }
    if (!parent) {
        next({name: 'admin'});
    } else if (requireAuth && !await checkAuth() && parent.path !== '/auth') {
        next({name: 'login'});
    } else if ((!!await checkRoles()) && (!(await checkRoles()).roles.length) && (parent.path !== '/user')) {
        next({name: 'user'});
    } else if ((!!await checkRoles()) && ((await checkRoles()).roles.length) && (parent.path !== '/admin')) {
        next({name: 'admin'});
    } else if (roles && !roles?.filter(async role => ((await checkRoles()).roles)?.includes(role)).length) {
        next(false)
    } else {
        next()
    }
});

router.afterEach((to, from) => {
    NProgress.done();
});
/*eslint-enable no-unused-vars*/

export default router;

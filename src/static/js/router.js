import Home from "./components/home.js";
import Register from "./components/register.js";
import CreateBlog from "./components/createBlog.js";
import Login from "./components/login.js";
import User from "./components/user.js";
import Search from "./components/search.js";
import Profile from "./components/profile.js";

const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/user",
        component: User,
    },
    {
        path: "/create-blog",
        component: CreateBlog,
    },
    {
        path: "/search",
        component: Search,
    },
    {
        path: "/profile",
        component: Profile,
    }
]

const router = new VueRouter({
    routes,
});

export default router;
import Home from "./components/home.js";
import Register from "./components/register.js";
import CreateBlog from "./components/createBlog.js";
import Login from "./components/login.js";
import User from "./components/user.js";
import Search from "./components/search.js";
import Profile from "./components/profile.js";
import Follower from "./components/follower.js";
import Following from "./components/following.js";
import EditBlog from "./components/editBlog.js";

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
        path: "/edit-blog",
        component: EditBlog,
    },
    {
        path: "/search",
        component: Search,
    },
    {
        path: "/profile",
        component: Profile,
    },
    {
        path: "/follower",
        component: Follower,
    },
    {
        path: "/following",
        component: Following,
    }
]

const router = new VueRouter({
    routes,
});

export default router;
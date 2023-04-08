import Home from "./components/home.js";
import Register from "./components/register.js";
import Posts from "./components/posts.js";
import Login from "./components/login.js";

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
        path: "/posts",
        component: Posts,
    }
]

const router = new VueRouter({
    routes,
});

export default router;
import Home from "./components/home.js";
import About from "./components/about.js";
import Course from "./components/course.js";
import ContactUs from "./components/contact.js";
import Posts from "./components/posts.js";


const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/about",
        component: About,
    },
    {
        path: "/contact-us",
        component: ContactUs,
    },
    {
        path: "/course/:id",
        component: Course,
        // props : True
        // children: {
        //     "/course/id/term_id"
        // }
    },
    {
        path: "/posts",
        component: Posts,
    },
]

const router = new VueRouter({
    routes,
});

export default router;
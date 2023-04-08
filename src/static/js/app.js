import router from "./router.js"
const app = new Vue({
    el: "#app",
    delimiters: ["${", "}"],
    router: router,
    data: {
        message: "Hello World !!",
        flag: false,
    },
    methods: {

    },
});
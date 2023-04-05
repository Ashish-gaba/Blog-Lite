import router from "./router.js"


const a = new Vue({
    el: "#app",
    delimiters: ["${", "}"],
    router: router,
    data: {
        message: "Hello World !!",
        flag: false,
    },
    methods: {

    },
    // mounted: {

    // } We can set flag value true/false whether user logged in or not then change the corresponding html
});
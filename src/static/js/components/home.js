const Home = Vue.component("home", {
    template: `
            <div>
                <h2> Home Page </h2>
                This is my home page !!
            </div>
    `,
    mounted: function(){
        document.title = "Blogs - Home"
    }
});

export default Home;
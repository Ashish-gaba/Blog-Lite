const Home = Vue.component("home", {
    template: `
            <div>
                <h2> Home Page </h2>
                This is my home page !!
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, nobis. Earum rem quidem deleniti distinctio sint itaque esse nemo aliquid ex, iusto similique consectetur eaque adipisci. Minus tempora perspiciatis recusandae fugiat exercitationem facere minima voluptatem. Modi, voluptatibus nam praesentium, eum beatae accusamus omnis cum sed ab dolore sint architecto? Magni.
            </div>
            
    `,

    mounted: function(){
        document.title = "Blogs - Home"
    }
});

export default Home;
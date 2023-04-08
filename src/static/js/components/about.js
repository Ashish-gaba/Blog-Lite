const About = Vue.component("about", {
    template: `
            <div>
                <h2> About Us </h2>
                This is the about page !!
            </div>
    `,
    mounted: function(){
        document.title = "Blogs - About"
    }
});

export default About;
const About = Vue.component("about", {
    template: `
            <div>
                <h2> About Us </h2>
                This is the about page !!
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, nobis. Earum rem quidem deleniti distinctio sint itaque esse nemo aliquid ex, iusto similique consectetur eaque adipisci. Minus tempora perspiciatis recusandae fugiat exercitationem facere minima voluptatem. Modi, voluptatibus nam praesentium, eum beatae accusamus omnis cum sed ab dolore sint architecto? Magni.
            </div>
            
    `,
    
    mounted: function(){
        document.title = "Blogs - About"
    }
});

export default About;
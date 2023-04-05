const Course = Vue.component("course", {
    template: `
            <div>
                <h2> Course </h2>
                This is the course page {{this.$route.params.id}} !!
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, nobis. Earum rem quidem deleniti distinctio sint itaque esse nemo aliquid ex, iusto similique consectetur eaque adipisci. Minus tempora perspiciatis recusandae fugiat exercitationem facere minima voluptatem. Modi, voluptatibus nam praesentium, eum beatae accusamus omnis cum sed ab dolore sint architecto? Magni.
            </div>
            
    ` ,
});

export default Course;
const Course = Vue.component("course", {
    template: `
            <div>
                <h2> Course </h2>
                This is the course page {{this.$route.params.id}} !!
            </div>
    ` ,
});

export default Course;
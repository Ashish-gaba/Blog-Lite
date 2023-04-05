const ContactUs = Vue.component("contact-us", {
    template: `
            <div>
                <h2> Contact Us </h2>
                Below are our contact details !!
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, nobis. Earum rem quidem deleniti distinctio sint itaque esse nemo aliquid ex, iusto similique consectetur eaque adipisci. Minus tempora perspiciatis recusandae fugiat exercitationem facere minima voluptatem. Modi, voluptatibus nam praesentium, eum beatae accusamus omnis cum sed ab dolore sint architecto? Magni.
            </div>
            
    `,
    
    mounted: function(){
        document.title = "Blogs - Contact Us"
    }
});

export default ContactUs;
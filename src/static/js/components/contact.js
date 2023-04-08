const ContactUs = Vue.component("contact-us", {
    template: `
            <div>
                <h2> Contact Us </h2>
                Below are our contact details !!
            </div>
    `,
    mounted: function(){
        document.title = "Blogs - Contact Us"
    }
});

export default ContactUs;
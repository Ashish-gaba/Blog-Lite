const Home = Vue.component("home", {
    template: `
            <!-- Bootstrap container class -->
<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-10">
            <h2 class="text-center mb-4">Welcome to Blog Lite Application</h2>
            <p class="lead" style="max-width: 100%">Thank you for visiting my application.
                <br>
                <br>
                As a recent graduate of the App Dev 1/2 course, I am excited to showcase my social media blog application. This project serves as a
                testament to my skills in web development and my passion for creating dynamic, user-friendly websites.
    
    
            <!-- Bootstrap form classes -->
            <div class="mb-3 d-flex justify-content-center">
                <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/login">Login user</button>
<!--                    <input type="submit" name="user_type" value="Login user" class="btn btn-outline-danger btn-lg">-->
                </div>
                <div class="mb-3">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/register">Register user</button>
<!--                    <input type="submit" name="user_type" value="Register user" class="btn btn-outline-danger btn-lg">-->
                </div>
            </div>
        </div>
    </div>
</div>

    `,
    mounted: function(){
        document.title = "Blog Lite"
    }
});

export default Home;
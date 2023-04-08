const Home = Vue.component("user", {
    template: `
<div class="container-fluid" id="app">
<nav class="navbar navbar-expand-lg bg-warning">
            <a class="navbar-brand" >Blog Lite - Vue App</a>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                </div>
            </div>
            <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/create-blog">Create blog</button>
                </div>
                 <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/search">Search</button>
                </div>
                <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/profile">My Profile</button>
                </div>
                <div class="mb-3">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/">Logout</button>
                </div>
        </nav>
<div>
{{this.name}} logged in
Your feed is empty.
</div>
</div>

    `,
    data: function () {
        return {
            name: 'User',
            username: '',
            id: '',
        };
    },
    mounted: function(){
        document.title = "User homepage"
        fetch('/userinfo')
            .then(response => response.json())
            .then(data => {
                this.name = data.name
                this.username = data.username
                this.id = data.id
            })
    }
});

export default Home;
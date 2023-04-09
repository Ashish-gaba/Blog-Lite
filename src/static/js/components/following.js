const Following = Vue.component("following", {
    template: `
<div class="container-fluid" id="app">
<nav class="navbar navbar-expand-lg bg-warning">
            <a class="navbar-brand" >Blog Lite - Vue App</a>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                </div>
            </div>
            <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/create-blog">Create blog</router-link></button>
                </div>
                 <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/search">Search</router-link></button>
                </div>
                <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/profile">My Profile</router-link></button>
                </div>
                <div class="mb-3">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/">Logout</router-link></button>
                </div>
        </nav>
<div>
People you follow: 
<div v-for="following in followings">
    {{following.username}}
    <button type="submit" @click="unfollowUser(following.id)" class="btn btn-primary">Unfollow</button>
</div>
</div>
</div>

    `,
    data: function () {
        return {
            followings: []
        };
    },
    methods: {
        unfollowUser: function (id) {
            fetch(`/unfollow_user/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.$router.push("/profile")
                })
                .catch(e => console.log("Error occurred: ", e.message));
        }
    },
    mounted: function () {
        document.title = "Following"
        fetch('/fetch_following')
            .then(response => response.json())
            .then(data => {
                this.followings = data
            })
    }
});

export default Following;
// TODO: Allow opening user profile
const Follower = Vue.component("follower", {
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
Your Followers: 
<div v-for="follower in followers">
    {{follower.username}}
    <button v-if="follower.doesFollow" @click="unfollowUser(follower.id)" type="submit" class="btn btn-primary">Unfollow</button>
    <button v-else type="submit" @click="followUser(follower.id)" class="btn btn-tertiary">Follow</button>
</div>
</div>
</div>

    `,
    data: function () {
        return {
            followers: []
        };
    },
    methods: {
        followUser: function (id) {
            fetch(`/follow/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.followers = []
                    this.$router.push("/profile")
                })
                .catch(e => console.log("Error occurred: ", e.message));
        },
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
        document.title = "Followers"
        fetch('/fetch_followers')
            .then(response => response.json())
            .then(data => {
                this.followers = data
            })
    }
});

export default Follower;
// TODO: Allow opening user profile

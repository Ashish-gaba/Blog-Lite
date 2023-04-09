const Follower = Vue.component("follower", {
    template: `
    <div class="container-fluid" id="app">
    <!-- Bootstrap container class -->
    <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;">
        <div class="container-fluid">

            <a class="navbar-brand" href="#">Blog Lite - Vue App</a>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/create-blog')">Create blog</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/search')">Search</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/profile')">My Profile</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/')">Logout</button>
                    </li>
                </ul>
            </div>
 
    </nav>
<div class="container my-3">
<h4>Your Followers:</h4> 
<div class="my-1" v-for="follower in followers">
<ul class="list-unstyled d-flex align-items-center">
                  <button style="color:blue; text-decoration:underline;" @click="fetchProfile(follower.id)" id="fetchProfile"  class="btn btn-tertiary-sm"> {{follower.username}}</button>
    <li>
    <button v-if="follower.doesFollow" @click="unfollowUser(follower.id)" type="submit" class="btn btn-outline-danger">Unfollow</button>
    <button v-else type="submit" @click="followUser(follower.id)" class="btn btn-outline-primary">Follow</button>
    </li>
    </ul>
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
        fetchProfile: function (id) {
            this.$router.push({
                name: "profile",
                params: {id}
            });
        },
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
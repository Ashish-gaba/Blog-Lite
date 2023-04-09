const Following = Vue.component("following", {
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
<h4>People you follow: </h4>
<div class="my-1" v-for="following in followings">
<ul class="list-unstyled d-flex align-items-center">
                  <button style="color:blue; text-decoration:underline;" @click="fetchProfile(following.id)" id="fetchProfile"  class="btn btn-tertiary-sm"> {{following.username}}</button>
<li>
    <button type="submit" @click="unfollowUser(following.id)" class="btn btn-outline-danger">Unfollow</button>
</li>
</ul>
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
        fetchProfile: function (id) {
            this.$router.push({
                name: "profile",
                params: {id}
            });
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
        document.title = "Following"
        fetch('/fetch_following')
            .then(response => response.json())
            .then(data => {
                this.followings = data
            })
    }
});

export default Following;

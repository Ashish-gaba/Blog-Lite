const User = Vue.component("user", {
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
<div v-if="isFeedEmpty">
{{this.name}} logged in
There are no posts in your feed.
Search and follow more people to see what they are posting!
</div>
        <div v-else class="card my-3 mx-3 col-4" style="width: 18rem;" v-for="blog in feed">
          <div class="card-body">
          <button style="color:blue; text-decoration:underline;" @click="fetchProfile(blog.creator_id)" id="fetchProfile"  class="btn btn-outline-tertiary-sm"> {{blog.creator_username}}</button>
            <h5 class="card-title"> {{blog.title}} </h5>
            <img :src="getImgUrl(blog)" width="200" height="200">
            <p class="card-text"> {{blog.description}} </p>
            </div>
            </div>
</div>
    `,
    data: function () {
        return {
            name: 'User',
            username: '',
            id: '',
            feed: [],
            isFeedEmpty: true
        };
    },
    methods: {
        fetchProfile: function (id) {
            this.$router.push({
                name: "profile",
                params: {id}
            });
        },
        getImgUrl(blog) {
            return blog.filePath
        },
    },
    mounted: function(){
        document.title = "User feed"
        fetch('/get_feed')
            .then(response => response.json())
            .then(data => {
                this.name = data.name
                this.username = data.username
                this.id = data.id
                this.feed = data.feed
                if(data.feed.length)
                    this.isFeedEmpty = false
            })
    }
});

export default User;
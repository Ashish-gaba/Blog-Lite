const Home = Vue.component("search", {
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
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/user">Home</button>
                </div>
                <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/profile">My Profile</button>
                </div>
                <div class="mb-3">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/">Logout</button>
                </div>
        </nav>
<div>

                            <label for="searchQuery" class="form-label">Search any user</label>
                            <input id="searchQuery" placeholder="Search a user by username" v-model = "searchQuery" type="text" name="searchQuery" class="form-control" required>
                            <input type="submit" @click="searchUsers" value="Search" class="btn btn-primary">
</div>
<div>
<div v-for="searchResult in searchResults">
    {{searchResult.username}}
    <button v-if="searchResult.doesFollow" type="submit" disabled="true"" class="btn btn-primary">Following</button>
    <button v-else type="submit" @click="followUser(searchResult.id)" class="btn btn-tertiary">Follow</button>
    
</div>
</div>
</div>

    `,
    data: function () {
        return {
            searchQuery: '',
            searchResults: []
        };
    },
    methods: {
        searchUsers: function () {
            fetch(`/search_user?query=${this.searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    this.searchResults = data
                })
        },
        followUser: function (id) {
            fetch(`/follow?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    this.searchResults = []
                    this.$router.push("/search")
                })
        }
    },
    mounted: function(){
        document.title = "User homepage"

    }
});

export default Home;
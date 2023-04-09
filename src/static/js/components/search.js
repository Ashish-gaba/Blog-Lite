const Search = Vue.component("search", {
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
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/user">Home</router-link></button>
                </div>
                <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/profile">My Profile</router-link></button>
                </div>
                <div class="mb-3">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/">Logout</router-link></button>
                </div>
        </nav>
<div>

                            <label for="searchQuery" class="form-label">Search any user</label>
                            <input id="searchQuery" placeholder="Type a username..." v-model = "searchQuery" type="text" name="searchQuery" class="form-control" required>
                            <input type="submit" @click="searchUsers" value="Search" class="btn btn-primary">
</div>
<div>
<div v-for="searchResult in searchResults">
    {{searchResult.username}}
    <button v-if="searchResult.doesFollow" @click="unfollowUser(searchResult.id)" type="submit" class="btn btn-primary">Unfollow</button>
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
            fetch(`/search_user/${this.searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    // TODO: Allow opening user profile
                    this.searchResults = data
                })
                .catch(e => console.log("Error occurred: ", e.message));
        },
        followUser: function (id) {
            fetch(`/follow/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.searchResults = []
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
        document.title = "Search Users"
    }
});

export default Search;
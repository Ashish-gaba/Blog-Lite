const Search = Vue.component("search", {
    template: `
    <div class="container-fluid" id="app">
    <!-- Bootstrap container class -->
    <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;">
        <div class="container-fluid">

            <a class="navbar-brand" href="#">Blog Lite - Vue App</a>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/create-blog')">Create Blog</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/user')">Home</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/profile')">My Profile</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/')">Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container my-3">
        <div class="row">
            <div class="col-md-6">
              
                <div class="form-group">
                    <label for="searchQuery" class="form-label"><h4>Search any user</h4></label>
                    <input id="searchQuery" placeholder="Search a user by username" v-model="searchQuery" type="text"
                        name="searchQuery" class="form-control" required>
                    <input type="submit" @click="searchUsers" value="Search" class="btn btn-primary my-2">
                </div>
            </div>
        </div>
    <div>

    <div class="my-1" v-for="searchResult in searchResults">
    <ul class="list-unstyled d-flex align-items-center">
              <button style="color:blue; text-decoration:underline;" @click="fetchProfile(searchResult.id)" id="fetchProfile"  class="btn btn-tertiary-sm"> {{searchResult.username}}</button>
      <li>
        <button v-if="searchResult.doesFollow" @click="unfollowUser(searchResult.id)" type="button" class="btn btn-outline-danger btn-sm">Unfollow</button>
        <button v-else @click="followUser(searchResult.id)" type="button" class="btn btn-outline-primary btn-sm">Follow</button>
      </li>
    </ul>
  </div>
  
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
        fetchProfile: function (id) {
            this.$router.push({
                name: "profile",
                params: {id}
            });
        },
        searchUsers: function () {
            fetch(`/search_user/${this.searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    if (data.loggedOutUser) {
                        this.$router.push("/")
                        return;
                    }
                    this.searchResults = data
                })
                .catch(e => console.log("Error occurred: ", e.message));
        },
        followUser: function (id) {
            fetch(`/follow/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.loggedOutUser) {
                        this.$router.push("/")
                        return;
                    }
                    this.searchResults = []
                    this.$router.push("/profile")
                })
                .catch(e => console.log("Error occurred: ", e.message));
        },
        unfollowUser: function (id) {
            fetch(`/unfollow_user/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.loggedOutUser) {
                        this.$router.push("/")
                        return;
                    }
                    this.$router.push("/profile")
                })
                .catch(e => console.log("Error occurred: ", e.message));
        }
    },
    mounted: function () {
        document.title = "Search Users"
        fetch('/check_authenticated_user')
            .then(r => r.json())
            .then(data => {
                if (data.loggedOutUser) {
                    this.$router.push("/")
                }
            })
    }
});

export default Search;
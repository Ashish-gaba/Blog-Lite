const Profile = Vue.component("profile", {
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
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/user">Home</router-link></button>
                </div>
                <div class="mb-3">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/">Logout</router-link></button>
                </div>
        </nav>
<div>
Profile image here
<!--TODO: Display and give option to upload-->
</div>


Total Blogs : {{blogsCount}}
<div id="followerCountDiv">
Followed by : <button @click="showFollowers" id="followerCount"  class="btn btn-primary"> {{followerCount}}</button>
</div>
<div id="followingCountDiv">
Following count : <button @click="showFollowings" id="followingCount"  class="btn btn-primary"> {{followingCount}}</button>
</div>

<div>
My blogs: 
<div v-for="blog in blogs">
    <div>{{blog.title}}</div>
    <div>{{blog.description}}</div>
    <button @click="editBlog(blog.id)" id="editBlog"  class="btn btn-primary">Edit Blog</button>
    <button @click="deleteBlog(blog.id)" id="deleteBlog"  class="btn btn-primary">Delete Blog</button>
</div>
</div>
</div>
        `,
    data: function () {
        return {
            blogsCount: 0,
            followingCount: 0,
            followerCount: 0,
            blogs: [],
        }
    },
    methods: {
        showFollowings: function () {
            this.$router.push("/following")
        },
        showFollowers: function () {
            this.$router.push("/follower")
        },
        editBlog: function (id) {
            this.$router.push({
                name: "edit_blog",
                params: {id}
            });
        },
        deleteBlog: function (id) {
            const isConfirmed = confirm("Are you sure you want to delete your blog?");
            if (isConfirmed) {
                fetch(`/delete_blog/${id}`)
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        this.blogs = data
                        this.blogsCount = this.blogsCount - 1;
                    })
                    .catch(e => console.log("Error occurred: ", e.message));
            }
        }
    },
    mounted: function () {
        document.title = "User profile"
        fetch('/user_profile')
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.blogsCount = data.blogsCount
                this.followingCount = data.followingCount
                this.followerCount = data.followerCount
                this.blogs = data.blogs
            })
            .catch(e => console.log("Error occurred: ", e.message));
    }
});

export default Profile


/*
TODO: Edit blog
 */
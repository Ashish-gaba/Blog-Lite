const Profile = Vue.component("profile", {
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
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/search')">Search</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/user')">Home</button>
                    </li>
                    <li>
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/')">Logout</button>
                    </li>
                </ul>
            </div>
 
    </nav>
<div class="container my-3">
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
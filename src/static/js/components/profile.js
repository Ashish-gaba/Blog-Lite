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
    {{username}}'s profile        
</div>
<div>
    <img :src="getProfilePicUrl()" width="100" height="100">
    <div  v-if="!isDifferentUser" class="mb-2">
                <label for="formFile" class="form-label my-2">Change Profile Pic</label>
                <input class="form-control" type="file" id="formFile" ref="formFile" v-on:change="handleProfilePicUpload">
            </div>
</div>


Total Blogs : {{blogsCount}}
<div id="followerCountDiv">
Followed by : <button style="color:blue; text-decoration:underline;" @click="showFollowers" id="followerCount" v-if="!isDifferentUser" class="btn btn-outline-tertiary-sm"> {{followerCount}}</button>
<div v-else>{{followerCount}}</div>
</div>
<div id="followingCountDiv">
Following count : <button style="color:blue; text-decoration:underline;" @click="showFollowings" id="followingCount" v-if="!isDifferentUser" class="btn btn-outline-tertiary-sm"> {{followingCount}}</button>
<div v-else>{{followingCount}}</div>
</div>

<div>
Posted blogs: 
<div v-for="blog in blogs">
<div>
Title: <div>{{blog.title}}</div>
    Description: <div>{{blog.description}}</div>
    <img :src="getImgUrl(blog)" width="200" height="200">
    <button @click="editBlog(blog.id)" v-if="!isDifferentUser" id="editBlog"  class="btn btn-primary">Edit Blog</button>
    <button @click="deleteBlog(blog.id)" v-if="!isDifferentUser" id="deleteBlog"  class="btn btn-primary">Delete Blog</button>
</div>
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
            isDifferentUser: false,
            name: '',
            username: '',
            profilePicUrl: ''
        }
    },
    methods: {
        handleProfilePicUpload() {
            const file = this.$refs.formFile.files[0];
            if(file) {
                let formData = new FormData();
                formData.append('file', file)
                fetch("/upload_profile_pic", {
                    method: "POST",
                    body: formData
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Success:", data);
                        this.$router.push("/profile")
                    })
                    .catch(e => console.log("Error occurred: ", e.message));
            }
        },
        getProfilePicUrl() {
            return this.profilePicUrl
        },
        getImgUrl(blog) {
            return blog.filePath
        },
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
        this.id = this.$route.params.id;
        fetch(`/user_profile/${this.id}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.blogsCount = data.blogsCount
                this.followingCount = data.followingCount
                this.followerCount = data.followerCount
                this.blogs = data.blogs
                this.isDifferentUser = data.isDifferentUser
                this.username = data.username
                this.name = data.name
                this.profilePicUrl = data.profilePicUrl
            })
            .catch(e => console.log("Error occurred: ", e.message));
    }
});

export default Profile
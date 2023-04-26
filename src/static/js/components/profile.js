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
        </div>
    </nav>
<div>
    {{name}}'s profile        
</div>
<div>
    <img :key="componentKey" :src="getProfilePicUrl()" width="100" height="100">
    <div  v-if="!isDifferentUser" class="mb-2">
                <label for="formFile" class="form-label my-2">Change Profile Pic</label>
                <input class="form-control" type="file" id="formFile" ref="formFile" v-on:change="handleProfilePicUpload">
            </div>
</div>

<h5>Total Blogs : {{blogsCount}}</h5>
<button @click="trigger_celery_job()" id="celeryJob"  class="btn btn-primary mt-1" v-if="!isDifferentUser">Export Blogs</button>

<div style="padding-top: 30px" id="followerCountDiv">
Followed by : <button style="color:blue; text-decoration:underline;" @click="showFollowers" id="followerCount" v-if="!isDifferentUser" class="btn btn-outline-tertiary-sm"> {{followerCount}}</button>
<div v-else>{{followerCount}}</div>
</div>
<div id="followingCountDiv">
Following count : <button style="color:blue; text-decoration:underline;" @click="showFollowings" id="followingCount" v-if="!isDifferentUser" class="btn btn-outline-tertiary-sm"> {{followingCount}}</button>
<div v-else>{{followingCount}}</div>
</div>

<div>
<h5 style="padding-top: 30px; padding-bottom: 20px; padding-left: 70px;text-decoration: underline;">Posted blogs:</h5> 
<div v-for="blog in blogs">
<div>
<div><h6>    Title: {{blog.title}}</h6></div>
    <div><h6>    Description: {{blog.description}}</h6></div>
    <div><img :src="getImgUrl(blog)" width="200" height="200"></div>
    <div>
    <button @click="editBlog(blog.id)" v-if="!isDifferentUser" id="editBlog"  class="btn btn-primary mt-1">Edit Blog</button>
    <button @click="deleteBlog(blog.id)" v-if="!isDifferentUser" id="deleteBlog"  class="btn btn-primary mt-1">Delete Blog</button>
    <div style="margin-bottom: 30px"></div>
</div>
    
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
            profilePicUrl: '',
            componentKey: 0,
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
                        if(data.loggedOutUser) {
                            this.$router.push("/")
                            return;
                        }
                        console.log("Success:", data);
                        this.componentKey += 1;
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
                        if(data.loggedOutUser) {
                            this.$router.push("/")
                            return;
                        }
                        this.blogs = data
                        this.blogsCount = this.blogsCount - 1;
                    })
                    .catch(e => console.log("Error occurred: ", e.message));
            }
        },
        trigger_celery_job : function () {
            fetch("/trigger-celery-job").then(r => r.json()
            ).then(d => {
                if(d.loggedOutUser) {
                    this.$router.push("/")
                    return;
                }
              console.log("Celery Task Details:", d);
              let interval = setInterval(() => {
                fetch(`/status/${d.Task_ID}`).then(r => r.json()
                ).then(d => {
                    if (d.Task_State === "SUCCESS") {
                      console.log("task finished")
                      clearInterval(interval);
                    //   fetch("/download-file").then(r => console.log(r))
                    window.location.href = "/download-file";
                    }
                    else {
                      console.log("task still executing")
                    }
                })
              }, 4000)
            })
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
                if(data.loggedOutUser) {
                    this.$router.push("/")
                    return;
                }
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
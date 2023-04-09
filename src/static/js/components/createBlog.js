const CreateBlog = Vue.component("create-blog", {

    template: `
<div class="container-fluid" id="app">
<nav class="navbar navbar-expand-lg bg-warning">
            <a class="navbar-brand" >Blog Lite - Vue App</a>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                </div>
            </div>
            <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/user">Home</router-link></button>
                </div>
                 <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/search">Search</router-link></button>
                </div>
                <div class="mb-3 me-2">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/profile">My Profile</router-link></button>
                </div>
                <div class="mb-3">
                    <button  class="btn btn-outline-danger btn-lg"><router-link to="/">Logout</router-link></button>
                </div>
        </nav>
        <div class="container my-3 mx-auto">
        <div class="row justify-content-left">
            <div class="col-md-6">
                <h4>Create a new blog</h4>
                <div class="form-group">
                    <label for="title" class="form-label my-2" >Title: </label>
                    <input id="title" v-model="title" type="text" maxlength="50" name="title" class="form-control" placeholder="Enter Title" required>
                    <label for="description" class="form-label my-2" >Description: </label>
                    <textarea id="description" v-model="description" type="text" maxlength="500" name="description"
                        class="form-control" rows="5" placeholder="Enter Description" required></textarea>
                </div>
            
    
            <div class="mb-2">
                <label for="formFile" class="form-label my-2">Upload Image</label>
                <input class="form-control" type="file" id="formFile" ref="formFile">
            </div>
            <div class="col d-flex justify-content-start">
                <input type="submit" @click="createBlog" value="Create Blog" class="btn btn-primary mt-2">
            </div>
        </div>
    </div>
    </div>
    </div>
  `,
    data: function () {
        return {
            title: '',
            description: '',
        };
    },

    methods: {
        createBlog: function () {
            const title = this.title;
            const description = this.description;
            const file = this.$refs.formFile.files[0];
            if (title && description && file) {
                const dataToSend = {
                    title,
                    description,
                };
                let formData = new FormData();
                formData.append('file', file)
                formData.append('data', JSON.stringify(dataToSend))

                fetch("/create_blog", {
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
    },

    mounted: function () {
        document.title = "Create blog";
    },
});

export default CreateBlog;
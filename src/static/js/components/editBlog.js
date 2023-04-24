const EditBlog = Vue.component("edit-blog", {
    template: `
    <div class="container-fluid" id="app">
    <!-- Bootstrap container class -->
    <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;">
        <div class="container-fluid">

            <a class="navbar-brand" href="#">Blog Lite - Vue App</a>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <button class="btn btn-outline-primary mx-1" @click="$router.push('/user')">Home</button>
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
    <div class="container my-3 mx-auto">
    <div class="row justify-content-left">
        <div class="col-md-6">
    <div class="container my-3 mx-auto">
        <div class="row justify-content-left">
            <div class="col-md-6">
                <h4>Edit an existing blog</h4>
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
                <input type="submit" @click="editBlog" value="Create Blog" class="btn btn-primary mt-2">
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
            id: '',
        };
    },

    methods: {
        editBlog: function () {
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

                fetch(`/edit_blog/${this.id}`, {
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
        this.id = this.$route.params.id;
        document.title = "Edit blog";
    },
});

export default EditBlog;
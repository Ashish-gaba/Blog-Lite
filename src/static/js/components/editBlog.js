const EditBlog = Vue.component("edit-blog", {

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
    <div>
                    <label for="title" class="form-label">Title: </label>
                    <input id="title" v-model = "title" type="text" maxlength="50" name="title" class="form-control" required>
                    <label for="description" class="form-label">Description: </label>
                    <input id="description" v-model = "description" type="text" maxlength="500" name="description" class="form-control" required>
                    <input type="submit" @click="createBlog" value="Create Blog" class="btn btn-primary">
<!--                    TODO: Image upload functionality in edit blog-->
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
            if (title && description) {
                const dataToSend = {
                    title,
                    description,
                };

                fetch("/edit_blog", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Success:", data);
                        this.$router.push("/profile")
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    })
            }
        },
    },

    mounted: function () {
        document.title = "Edit blog";
    },
});

export default EditBlog;
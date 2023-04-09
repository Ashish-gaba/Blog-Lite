const Register = Vue.component("register", {
    template: `
    <div class="container-fluid" id="app">
    <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;">
                <a class="navbar-brand" href="#">Blog Lite - Vue App</a>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                    </div>
                </div>
            </nav>
            <div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card">
                <div class="card-header">
                    <h1 class="text-center">Register User</h1>
                </div>
                <div class="card-body">
                    <div>
                        <div class="mb-3">
                            <label for="username" class="form-label">Username:</label>
                            <input id="username" v-model = "username" maxlength="16" type="text" name="username" class="form-control" placeholder="Enter username" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password:</label>
                            <input id="password" v-model = "password" maxlength="16" type="password" name="password" class="form-control" placeholder="Enter password" required>
                        </div>
                        <div class="mb-3">
                            <label for="name" class="form-label">Name of user:</label>
                            <input id="name" v-model = "name" type="text" maxlength="30" name="name" class="form-control" placeholder="Enter your name" required>
                        </div>
                        <div class="d-grid">
                            <input type="submit" @click="register_user" value="Register" class="btn btn-primary">
                            <span style="color:red;" id="error" v-if="error"> {{ this.error }} </span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</div>
    `,
    data: function () {
        return {
            username: '',
            password: '',
            name: '',
            error: ''
        }
    },
    methods: {
        register_user: function () {
            const username = this.username;
            const password = this.password;
            const name = this.name;
            if (username && password && name) {
                const data = {
                    username,
                    password,
                    name
                };
                fetch("/register_user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            this.error = data.error;
                            this.$router.push("/register")
                            return;
                        }
                        this.error = '';
                        this.$router.push("/login")
                    })
                    .catch(e => console.log("Error occurred: ", e.message));
            }
        }
    },
    mounted: function () {
        document.title = "Register user"
    }
});

export default Register;
const Login = Vue.component("login", {
    template: `
            <div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h1 class="text-center">User Login</h1>
                </div>
                <div class="card-body">
                    <form>
                        <div class="mb-3">
                            <label for="username" class="form-label">Enter username:</label>
                            <input id="username" v-model = "username" type="text" name="username" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Enter password:</label>
                            <input id="password" v-model = "password" type="password" name="password" class="form-control" required>
                        </div>
                        <div class="d-grid">
                            <input type="submit" @click="login_user" value="Login" class="btn btn-outline-danger">
                            <span style="color:red;" id="error" v-if="error"> {{ this.error }} </span>
                        </div>
                    </form>
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
            error: ''
        }
    },
    methods: {
        login_user: function () {
            const username = this.username;
            const password = this.password;
            if (username && password) {
                const data = {
                    username,
                    password,
                };
                fetch("/login_user", {
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
                            this.$router.push("/login")
                            return;
                        }
                        this.error = '';
                        this.$router.push("/")
                    })
                    .catch(e => console.log("Error occurred: ", e.message));
            }
        }
    },
    mounted: function () {
        document.title = "Login user"
    }
});

export default Login;

/*
TODO: Fix URL => no #, query params at end
 */
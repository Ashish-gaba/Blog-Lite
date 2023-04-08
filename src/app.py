from flask import Flask, render_template, jsonify, request, session
from models import *

app = Flask(__name__)
db.init_app(app)
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///blogs_database.sqlite3?charset=utf8"
app.config['SECRET_KEY'] = 'SecretKeyForSession'

@app.route("/")
def home():
    session.pop('username', None)
    return render_template("index.html")

@app.route("/register_user", methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')

    users = User.query.filter_by(username=username).all()
    if users != []:
        # User with same username exists
        return jsonify({'error': 'Username taken. Please try again.'})
    user = User(username=username, password=password, name=name)
    db.session.add(user)
    db.session.commit()
    return jsonify("User successfully registered")


@app.route("/login_user", methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    users = User.query.filter_by(username=username).all()
    if users == [] or users[0].password != password:
        return jsonify({'error': 'Invalid credentials. Please try again.'})
    session['username'] = username
    #TODO: token based auth
    return jsonify("User logged in successfully")

@app.route("/userinfo", methods=["GET"])
def get_userifo():
    user = User.query.filter_by(username=session.get('username')).all()[0]
    data = {
        'id': user.id,
        'name': user.name,
        'username': user.username
    }
    return jsonify(data)

@app.route("/create_blog", methods=['POST'])
def create_blog():
    data = request.get_json()
    user = User.query.filter_by(username=session.get('username')).all()[0]
    blog = Blog(title = data.get("title"), description = data.get("description"), creator_user_id=user.id)
    db.session.add(blog)
    db.session.commit()
    return jsonify("Blog successfully added")

@app.route("/search_user", methods=["GET"])
def search_user():
    query = request.args.get('query')
    loggedInUserId = User.query.filter_by(username=session.get('username')).all()[0].id
    following = Follow.query.filter_by(follower_id=loggedInUserId).all()
    followingIds = [ el.following_id for el in following]
    users = User.query.all()
    data = []
    for user in users:
        if query in user.username and user.id!=loggedInUserId:
            doesFollow = True if user.id in followingIds else False
            data.append({
                'id': user.id,
                'username': user.username,
                'doesFollow': doesFollow
            })
    return jsonify(data)

@app.route("/follow", methods=["GET"])
def follow():
    followingId = request.args.get('id')
    loggedInUserId = User.query.filter_by(username=session.get('username')).all()[0].id
    follow = Follow(follower_id=loggedInUserId, following_id=followingId)
    db.session.add(follow)
    db.session.commit()
    return jsonify("Followed successfully")

# @app.route("/updateblog/<id>", methods=['POST'])
# def update_blog(id):
#     data = request.get_json()
#     blog = Blog.query.get(id)
#     blog.title = data.get("title")
#     blog.description = data.get("desc")
#     db.session.commit()
#     return jsonify("Post successfully updated")
#
#
#
# @app.route("/getallposts")
# def get_all_posts():
#     blogs = Blog.query.all()
#     data = []
#     for blog in blogs:
#         data.append({
#             'id': blog.id,
#             'title': blog.title,
#             'description': blog.description
#         })
#     return jsonify(data)
#
# @app.route("/deleteblog/<id>")
# def delete_blog(id):
#     blog = Blog.query.get(id)
#     db.session.delete(blog)
#     db.session.commit()
#     return jsonify("Card deleted...")

if __name__ == "__main__":
    db.create_all()
    app.run(debug=False)

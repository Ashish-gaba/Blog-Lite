from flask import Flask, render_template, jsonify, request, session, url_for
from models import *
from operator import itemgetter
from datetime import datetime
from pytz import timezone
import json
import os

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
    return jsonify("User logged in successfully")


@app.route("/get_feed", methods=["GET"])
def get_feed():
    feed = []
    user = User.query.filter_by(username=session.get('username')).first()
    following = Follow.query.filter_by(follower_id=user.id).all()
    followingIds = [el.following_id for el in following]
    for followingId in followingIds:
        blogs = Blog.query.filter_by(creator_user_id=followingId).all()
        creator = User.query.get(followingId)
        for blog in blogs:
            feed.append({
                'title': blog.title,
                'description': blog.description,
                'filePath': url_for('static', filename=f'uploads/{blog.id}.png'),
                'last_updated': blog.last_updated_timestamp,
                'creator_username': creator.username,
                'creator_id': followingId
            })
    sortedFeed = sorted(feed, key=itemgetter('last_updated'), reverse=True)
    data = {
        'id': user.id,
        'name': user.name,
        'username': user.username,
        'feed': sortedFeed
    }
    return jsonify(data)


@app.route("/create_blog", methods=['POST'])
def create_blog():
    file = request.files.get('file')
    data = json.loads(request.form.get('data'))
    user = User.query.filter_by(username=session.get('username')).first()
    blog = Blog(title=data.get("title"), description=data.get("description"), creator_user_id=user.id,
                created_timestamp=datetime.now(timezone('Asia/Kolkata')),
                last_updated_timestamp=datetime.now(timezone('Asia/Kolkata')))

    db.session.add(blog)
    db.session.commit()
    db.session.refresh(blog)

    currDir = os.path.abspath(os.path.dirname(__file__))
    file.save(currDir + '/static/uploads/' + str(blog.id) + '.png')
    return jsonify("Blog successfully added")


@app.route("/search_user/<query>", methods=["GET"])
def search_user(query):
    loggedInUserId = User.query.filter_by(username=session.get('username')).first().id
    following = Follow.query.filter_by(follower_id=loggedInUserId).all()
    followingIds = [el.following_id for el in following]
    users = User.query.all()
    data = []
    for user in users:
        if query.lower() in user.username.lower() and user.id != loggedInUserId:
            doesFollow = True if user.id in followingIds else False
            data.append({
                'id': user.id,
                'username': user.username,
                'doesFollow': doesFollow
            })
    return jsonify(data)


@app.route("/follow/<followingId>", methods=["GET"])
def follow(followingId):
    loggedInUserId = User.query.filter_by(username=session.get('username')).first().id
    follow = Follow(follower_id=loggedInUserId, following_id=followingId)
    db.session.add(follow)
    db.session.commit()
    return jsonify("Followed successfully")


@app.route("/user_profile/<id>", methods=["GET"])
def user_profile(id):
    loggedInUser = User.query.filter_by(username=session.get('username')).first()
    loggedInUserId = loggedInUser.id
    if id == 'undefined':
        id = loggedInUserId
    displayUser = User.query.get(id)
    blogs = Blog.query.filter_by(creator_user_id=id).all()
    blogsToSend = []

    for el in blogs:
        blogsToSend.append({
            'id': el.id,
            'title': el.title,
            'description': el.description,
            'filePath': url_for('static', filename=f'uploads/{el.id}.png')
        })
    blogsCount = len(blogsToSend)
    followerCount = len(Follow.query.filter_by(following_id=id).all())
    followingCount = len(Follow.query.filter_by(follower_id=id).all())

    profilePicDir = os.path.abspath(os.path.dirname(__file__)) + '/static/uploads/profile_pic'
    paths = os.listdir(profilePicDir)
    profilePicNA = True
    for path in paths:
        if str(id) in path:
            profilePicNA = False

    profilePicId = str(id) if profilePicNA==False else 'default'

    data = {
        'blogs': blogsToSend,
        'blogsCount': blogsCount,
        'followingCount': followingCount,
        'followerCount': followerCount,
        'isDifferentUser': True if id != loggedInUserId else False,
        'username': displayUser.username,
        'name': displayUser.name,
        'profilePicUrl': url_for('static', filename=f'uploads/profile_pic/{profilePicId}.png')
    }
    return jsonify(data)


@app.route("/fetch_following", methods=["GET"])
def fetch_following():
    loggedInUserId = User.query.filter_by(username=session.get('username')).first().id
    following = Follow.query.filter_by(follower_id=loggedInUserId).all()
    followingData = []
    for el in following:
        username = User.query.filter_by(id=el.following_id).first().username
        followingData.append({
            'id': el.following_id,
            'username': username,
        })
    return jsonify(followingData)


@app.route("/fetch_followers", methods=["GET"])
def fetch_followers():
    loggedInUserId = User.query.filter_by(username=session.get('username')).first().id
    following = Follow.query.filter_by(follower_id=loggedInUserId).all()
    followingIds = [el.following_id for el in following]
    followers = Follow.query.filter_by(following_id=loggedInUserId).all()
    followersData = []
    for el in followers:
        username = User.query.filter_by(id=el.follower_id).first().username
        followersData.append({
            'id': el.follower_id,
            'username': username,
            'doesFollow': True if el.follower_id in followingIds else False
        })
    return jsonify(followersData)


@app.route("/unfollow_user/<unfollowId>", methods=["GET"])
def unfollow_user(unfollowId):
    loggedInUserId = User.query.filter_by(username=session.get('username')).first().id
    following = db.session.query(Follow).filter(Follow.follower_id == loggedInUserId).filter(
        Follow.following_id == unfollowId).first()
    if following:
        db.session.delete(following)
        db.session.commit()
    return jsonify("Unfollow successful")


@app.route("/edit_blog/<id>", methods=['POST'])
def edit_blog(id):
    file = request.files.get('file')
    data = json.loads(request.form.get('data'))
    blog = Blog.query.get(id)
    blog.title = data.get("title")
    blog.description = data.get("description")
    db.session.commit()
    currDir = os.path.abspath(os.path.dirname(__file__))
    file.save(currDir + '/static/uploads/' + str(id) + '.png')
    return jsonify("Blog successfully edited")

@app.route("/delete_blog/<id>")
def delete_blog(id):
    blog = Blog.query.get(id)
    db.session.delete(blog)
    db.session.commit()
    loggedInUserId = User.query.filter_by(username=session.get('username')).first().id
    blogs = Blog.query.filter_by(creator_user_id=loggedInUserId).all()
    blogsToSend = []
    for el in blogs:
        blogsToSend.append({
            'id': el.id,
            'title': el.title,
            'description': el.description,
        })
    return jsonify(blogsToSend)

@app.route("/upload_profile_pic", methods=['POST'])
def upload_profile_pic():
    user = User.query.filter_by(username=session.get('username')).first()
    file = request.files.get('file')
    currDir = os.path.abspath(os.path.dirname(__file__))
    file.save(currDir + '/static/uploads/profile_pic/' + str(user.id) + '.png')
    return jsonify("Picture successfully updated")


if __name__ == "__main__":
    db.create_all()
    app.run(debug=False)

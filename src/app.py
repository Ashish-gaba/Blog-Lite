from flask import Flask, render_template, jsonify, request, session
from models import *
from operator import itemgetter
from datetime import datetime, timedelta
from pytz import timezone
import jwt

app = Flask(__name__)
db.init_app(app)
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///blogs_database.sqlite3?charset=utf8"
app.config['SECRET_KEY'] = 'SecretKeyForSession'

@app.route("/")
def home():
    auth_token = session.get('auth_token')
    if auth_token:
        user_id = User.decode_auth_token(auth_token=session.get('auth_token'))
        if user_id and not isinstance(user_id, str):
            expired_token = ExpiredToken(token=auth_token)
            # insert the token
            db.session.add(expired_token)
            db.session.commit()
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
    auth_token = user.encode_auth_token(user.id)
    responseObject = {
        'status': 'success',
        'message': 'User successfully registered.',
        'auth_token': auth_token.decode()
    }
    return jsonify(responseObject)


@app.route("/login_user", methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    users = User.query.filter_by(username=username).all()
    if users == [] or users[0].password != password:
        return jsonify({'error': 'Invalid credentials. Please try again.'})
    auth_token = users[0].encode_auth_token(users[0].id)
    if auth_token:
        responseObject = {
            'status': 'success',
            'message': 'User logged in successfully.',
            'auth_token': auth_token.decode()
        }
    session['username'] = username
    session['auth_token'] = auth_token
    return jsonify(responseObject)

@app.route("/get_feed", methods=["GET"])
def get_feed():
    feed = []
    user_id = User.decode_auth_token(auth_token=session.get('auth_token'))
    user = User.query.get(user_id)
    following = Follow.query.filter_by(follower_id=user.id).all()
    followingIds = [el.following_id for el in following]
    for followingId in followingIds:
        blogs = Blog.query.filter_by(creator_user_id=followingId).all()
        creator = User.query.get(followingId)
        for blog in blogs:
            feed.append({
                'title': blog.title,
                'description': blog.description,
                'image': blog.image,
                'last_updated': blog.last_updated_timestamp,
                'creator_username': creator.username,
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
    data = request.get_json()
    user_id = User.decode_auth_token(auth_token=session.get('auth_token'))
    user = User.query.get(user_id)
    blog = Blog(title = data.get("title"), description = data.get("description"), creator_user_id=user.id,
                created_timestamp=datetime.now(timezone('Asia/Kolkata')), last_updated_timestamp=datetime.now(timezone('Asia/Kolkata')))
    db.session.add(blog)
    db.session.commit()
    return jsonify("Blog successfully added")

@app.route("/search_user/<query>", methods=["GET"])
def search_user(query):
    loggedInUserId = User.decode_auth_token(auth_token=session.get('auth_token'))
    following = Follow.query.filter_by(follower_id=loggedInUserId).all()
    followingIds = [ el.following_id for el in following]
    users = User.query.all()
    data = []
    for user in users:
        if query.lower() in user.username.lower() and user.id!=loggedInUserId:
            doesFollow = True if user.id in followingIds else False
            data.append({
                'id': user.id,
                'username': user.username,
                'doesFollow': doesFollow
            })
    return jsonify(data)

@app.route("/follow/<followingId>", methods=["GET"])
def follow(followingId):
    loggedInUserId = User.decode_auth_token(auth_token=session.get('auth_token'))
    follow = Follow(follower_id=loggedInUserId, following_id=followingId)
    db.session.add(follow)
    db.session.commit()
    return jsonify("Followed successfully")

@app.route("/user_profile", methods=["GET"])
def user_profile():
    loggedInUserId = User.decode_auth_token(auth_token=session.get('auth_token'))
    blogs = Blog.query.filter_by(creator_user_id=loggedInUserId).all()
    blogsToSend = []
    for el in blogs:
        blogsToSend.append({
            'id': el.id,
            'title': el.title,
            'description': el.description,
        })
    blogsCount = len(blogsToSend)
    followerCount = len(Follow.query.filter_by(following_id=loggedInUserId).all())
    followingCount = len(Follow.query.filter_by(follower_id=loggedInUserId).all())
    # followersToSend = []
    # for el in followers:
    #     username = User.query.filter_by(id=el.follower_id).first().username
    #     followersToSend.append({
    #         'id': el.follower_id,
    #         'username': username,
    #     })

    data = {
        'blogs': blogsToSend,
        'blogsCount': blogsCount,
        'followingCount': followingCount,
        'followerCount': followerCount,
    }
    return jsonify(data)

@app.route("/fetch_following", methods=["GET"])
def fetch_following():
    loggedInUserId = User.decode_auth_token(auth_token=session.get('auth_token'))
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
    loggedInUserId = User.decode_auth_token(auth_token=session.get('auth_token'))
    following = Follow.query.filter_by(follower_id=loggedInUserId).all()
    followingIds = [ el.following_id for el in following]
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
    loggedInUserId = User.decode_auth_token(auth_token=session.get('auth_token'))
    following = db.session.query(Follow).filter(Follow.follower_id==loggedInUserId).filter(Follow.following_id==unfollowId).first()
    if following:
        db.session.delete(following)
        db.session.commit()
    return jsonify("Unfollow successful")

@app.route("/edit_blog/<id>", methods=['POST'])
def edit_blog(id):
    data = request.get_json()
    blog = Blog.query.get(id)
    blog.title = data.get("title")
    blog.description = data.get("description")
    # TODO: Image
    db.session.commit()
    return jsonify("Post successfully edited")

@app.route("/delete_blog/<id>")
def delete_blog(id):
    blog = Blog.query.get(id)
    db.session.delete(blog)
    db.session.commit()
    loggedInUserId = User.decode_auth_token(auth_token=session.get('auth_token'))
    blogs = Blog.query.filter_by(creator_user_id=loggedInUserId).all()
    blogsToSend = []
    for el in blogs:
        blogsToSend.append({
            'id': el.id,
            'title': el.title,
            'description': el.description,
        })
    return jsonify(blogsToSend)

if __name__ == "__main__":
    db.create_all()
    app.run(debug=False)

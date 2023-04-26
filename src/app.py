from flask import Flask, render_template, jsonify, request, session, url_for, send_file
from models import *
from celery_worker import make_celery
from celery.result import AsyncResult
from celery.schedules import crontab
from operator import itemgetter
from datetime import date, datetime, timedelta
from pytz import timezone
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_caching import Cache
from time import perf_counter_ns
from dateutil.relativedelta import relativedelta

app = Flask(__name__)
db.init_app(app)
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///blogs_database.sqlite3?charset=utf8&check_same_thread=False"
app.config['SECRET_KEY'] = 'SecretKeyForSession'


SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "admin_ashish@bloglite.com"
SENDER_PASSWORD = ""

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379',
    REDIS_URL = "redis://localhost:6379",
    CACHE_TYPE = "RedisCache",
    CACHE_DEFAULT_TIMEOUT = 15,
    CACHE_REDIS_HOST = "localhost",
    CACHE_REDIS_PORT = 6379,
    CACHE_REDIS_DB = 9
)
celery = make_celery(app)

cache = Cache(app)


@cache.memoize(10)
def cached_logged_in_user(user_id):
    print("Inside get user cache method")
    return User.query.get(user_id)


@cache.memoize(10)
def cached_blog_feed(following_id):
    print("Inside get blogs cache method")
    return Blog.query.filter_by(creator_user_id=following_id).all()


@app.route("/check_authenticated_user", methods=['GET'])
def check_authenticated_user():
    user_id = check_and_get_authenticated_user()
    if user_id == False:
        return jsonify({'loggedOutUser': True})
    return jsonify({'loggedOutUser': False})

def check_and_get_authenticated_user():
    auth_token = session.get('auth_token')
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token=session.get('auth_token'))
        if decoded_token and not isinstance(decoded_token, str):
            user_id = decoded_token['sub']
            expiry_time = decoded_token['exp']
            current_time = datetime.now().timestamp()
            if current_time < expiry_time:
                return user_id
    return False

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=19),
        send_email.s(),
        name='sends a reminder email every 19th hour(at 7:00pm) of every day'
    )
    sender.add_periodic_task(
        crontab(day_of_month=1),
        send_report.s(),
        name='sends an email report every first day of the  month'
    )

@celery.task
def send_report():
    print("send_report called")
    users = User.query.all()
    for user in users:
        modified_date = datetime.today().replace(day=1, hour=0, minute=0, second=0) - relativedelta(months=1)
        blogs = Blog.query.filter_by(creator_user_id=user.id).filter(Blog.created_timestamp>=modified_date).all()

        to_address = f'{user.name}@gmail.com'
        subject = f"{user.username}, your monthly report on BlogLite!"
        message = "Here are your blogs:\n"
        for blog in blogs:
            message += "Title: "
            message += f"{blog.title}\n"
            message += "Description: "
            message += f"{blog.description}\n\n"

        msg = MIMEMultipart()
        msg["From"] = SENDER_ADDRESS
        msg["To"] = to_address
        msg["Subject"] = subject
        msg.attach(MIMEText(message, "HTML"))

        # creating SMTP object with address to whom to send email
        s = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
        s.login(SENDER_ADDRESS, SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()


    return "Send Report job started.."

@celery.task
def send_email():
    print("send_email called")
    users = User.query.all()
    for user in users:
        if not has_user_posted_today(user.id):
            to_address = f'{user.name}@gmail.com'
            subject = f"{user.username}, you have not posted anything today!"
            message = "Post something and let the world know what's on your mind today!"

            msg = MIMEMultipart()
            msg["From"] = SENDER_ADDRESS
            msg["To"] = to_address
            msg["Subject"] = subject
            msg.attach(MIMEText(message, "HTML"))

            # creating SMTP object with address to whom to send email
            s = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
            s.login(SENDER_ADDRESS, SENDER_PASSWORD)
            s.send_message(msg)
            s.quit()
    return "Send Email job started.."        

def has_user_posted_today(user_id):
    today = date.today()
    blogs_posted_today = Blog.query.filter_by(creator_user_id=user_id).filter(Blog.created_timestamp>=today).all()
    if blogs_posted_today == []:
        return False
    return True

@celery.task
def generate_csv(user_id):
    import csv
    import pandas as pd


    userBlogs = Blog.query.filter_by(creator_user_id=user_id).all()
    allCols = ['title', 'description']
    df = pd.DataFrame(columns=allCols)
    for idx, blog in enumerate(userBlogs):
        df.at[idx,'title'] = blog.title
        df.at[idx,'description'] = blog.description
    
    with open("static/data.csv", 'w') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(allCols)
        csvwriter.writerows(df.values)

    return "Started the job"

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
    session.pop('auth_token', None)
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
    auth_token = users[0].encode_auth_token(users[0].id)
    if auth_token:
        session['auth_token'] = auth_token
    # send_email()
    return jsonify("User logged in successfully")


@app.route("/get_feed", methods=["GET"])
def get_feed():
    feed = []
    user_id = check_and_get_authenticated_user()
    if user_id == False:
        return jsonify({'loggedOutUser': True})
    start = perf_counter_ns()
    user = cached_logged_in_user(user_id)
    stop = perf_counter_ns()
    print("Time taken to fetch user:", stop - start)
    following = Follow.query.filter_by(follower_id=user.id).all()
    followingIds = [el.following_id for el in following]
    for followingId in followingIds:
        start = perf_counter_ns()
        blogs = cached_blog_feed(followingId)
        stop = perf_counter_ns()
        print("Time taken to fetch blogs for feed:", stop - start)
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
    user_id = check_and_get_authenticated_user()
    if user_id == False:
        return jsonify({'loggedOutUser': True})
    start = perf_counter_ns()
    user = cached_logged_in_user(user_id)
    stop = perf_counter_ns()
    print("Time taken to fetch user:", stop - start)
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
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
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
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
    follow = Follow(follower_id=loggedInUserId, following_id=followingId)
    db.session.add(follow)
    db.session.commit()
    return jsonify("Followed successfully")


@app.route("/user_profile/<id>", methods=["GET"])
def user_profile(id):
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
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
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
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
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
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
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
    following = db.session.query(Follow).filter(Follow.follower_id == loggedInUserId).filter(
        Follow.following_id == unfollowId).first()
    if following:
        db.session.delete(following)
        db.session.commit()
    return jsonify("Unfollow successful")


@app.route("/edit_blog/<id>", methods=['POST'])
def edit_blog(id):
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
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
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
    blog = Blog.query.get(id)
    db.session.delete(blog)
    db.session.commit()
    blogs = Blog.query.filter_by(creator_user_id=loggedInUserId).all()
    blogsToSend = []
    for el in blogs:
        blogsToSend.append({
            'id': el.id,
            'title': el.title,
            'description': el.description,
            'filePath': url_for('static', filename=f'uploads/{el.id}.png')
        })
    return jsonify(blogsToSend)

@app.route("/upload_profile_pic", methods=['POST'])
def upload_profile_pic():
    loggedInUserId = check_and_get_authenticated_user()
    if loggedInUserId == False:
        return jsonify({'loggedOutUser': True})
    file = request.files.get('file')
    currDir = os.path.abspath(os.path.dirname(__file__))
    file.save(currDir + '/static/uploads/profile_pic/' + str(loggedInUserId) + '.png')
    return jsonify("Picture successfully updated")


# Celery
@app.route("/trigger-celery-job")
def trigger_celery_job():
    user_id = check_and_get_authenticated_user()
    if user_id == False:
        return jsonify({'loggedOutUser': True})
    a = generate_csv.delay(user_id)
    return jsonify({
        "Task_ID" : a.id,
        "Task_State" : a.state,
        "Task_Result" : a.result
    })

@app.route("/status/<id>")
def check_status(id):
    res = AsyncResult(id, app = celery)
    return {
        "Task_ID" : res.id,
        "Task_State" : res.state,
        "Task_Result" : res.result
    }

@app.route("/download-file")
def download_file():
    return send_file("static/data.csv")

if __name__ == "__main__":
    db.create_all()
    cache = Cache(app)
    app.run(debug=False)

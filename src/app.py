from flask import Flask, render_template, jsonify, request
from models import *

app = Flask(__name__)
db.init_app(app)
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///blogs_database.sqlite3?charset=utf8"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/getallposts")
def get_all_posts():
    blogs = Blog.query.all()  
    data = []
    for blog in blogs:
        data.append({
            'id': blog.id,
            'title': blog.title,
            'description': blog.description
        })
    return jsonify(data)

@app.route("/createblog", methods=['POST'])
def create_blog():
    data = request.get_json()
    blog = Blog(title = data.get("title", None), description = data.get("desc", None))
    db.session.add(blog)
    db.session.commit()
    return jsonify("Post successully added")

@app.route("/updateblog/<id>", methods=['POST'])
def update_blog(id):
    data = request.get_json()
    blog = Blog.query.get(id)
    blog.title = data.get("title")
    blog.description = data.get("desc")
    db.session.commit()
    return jsonify("Post successfully updated")


@app.route("/deleteblog/<id>")
def delete_blog(id):
    blog = Blog.query.get(id)
    db.session.delete(blog)
    db.session.commit()
    return jsonify("Card deleted...")

if __name__ == "__main__":
    db.create_all()
    app.run(debug=False)

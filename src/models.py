from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import Engine
from sqlalchemy import event
from datetime import datetime
from pytz import timezone

db = SQLAlchemy()

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer(), primary_key = True)
    username = db.Column(db.String(16), unique=True, nullable=False)
    password = db.Column(db.String(16), nullable = False)
    name = db.Column(db.String(30), nullable=False)
    profile_image = db.Column(db.String(128))
    def __repr__(self):
        return "<User %r>" %self.username

class Blog(db.Model):
    __tablename__ = "blog"
    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    image = db.Column(db.String(128))
    creator_user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    created_timestamp = db.Column(db.DateTime, default=datetime.now(timezone('Asia/Kolkata')), nullable=False)
    last_updated_timestamp = db.Column(db.DateTime, onupdate=datetime.now(timezone('Asia/Kolkata')), default=datetime.now(timezone('Asia/Kolkata')))
    def __repr__(self):
        return "<Blog %r>" %self.title

class Follow(db.Model):
    __tablename__ = "follow"
    id = db.Column(db.Integer(), primary_key=True)
    follower_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable=False)
    following_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable=False)
    def __repr__(self):
        return "<Follow %r>" %self.id
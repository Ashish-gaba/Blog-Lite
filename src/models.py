from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import Engine
from sqlalchemy import event
import jwt
from datetime import datetime, timedelta

db = SQLAlchemy()

config = {}
config['SECRET_KEY'] = 'SecretKeyForSession'

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
    def __repr__(self):
        return "<User %r>" %self.username

    def encode_auth_token(self, user_id):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, minutes=60),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            config.get('SECRET_KEY'),
            algorithm='HS256'
        )

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token, config.get('SECRET_KEY'), algorithms=['HS256'])
            is_expired_token = ExpiredToken.check_expired(auth_token)
            if is_expired_token:
                return 'Token expired. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

class Blog(db.Model):
    __tablename__ = "blog"
    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    creator_user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    created_timestamp = db.Column(db.DateTime, nullable=False)
    last_updated_timestamp = db.Column(db.DateTime, nullable=False)
    def __repr__(self):
        return "<Blog %r>" %self.title

class Follow(db.Model):
    __tablename__ = "follow"
    id = db.Column(db.Integer(), primary_key=True)
    follower_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable=False)
    following_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable=False)
    def __repr__(self):
        return "<Follow %r>" %self.id

class ExpiredToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'expired_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    expired_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.expired_on = datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_expired(auth_token):
        # check whether auth token has been blacklisted
        res = ExpiredToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False
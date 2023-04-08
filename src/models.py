from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Blog(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(50))
    def __repr__(self):
        return "<Blog %r>" %self.title
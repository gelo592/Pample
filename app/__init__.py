# Import flask and template operators
from flask import Flask, render_template

# Import DertaBursies
from flask_peewee.db import Database

import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

# Import Login / Security
from flask.ext.security import Security, PeeweeUserDatastore, \
    UserMixin, RoleMixin, login_required

# Define the WSGI application object
app = Flask(__name__)

# Configurations
app.config.from_object('configgypuddin')

# Define the database object which is imported
# by modules and controllers
db = Database(app)

from app.auth.models import User, UserRoles, Role
user_datastore = PeeweeUserDatastore(db, User, Role, UserRoles)
security = Security(app, user_datastore)

# index
@app.route('/')
def index():
  return render_template("splash.html")

# catch all those other paths
@app.route('/<path:path>')
def page_no_exist(path):
  return 'clever 404 for www.kermpany.com/%s' % path
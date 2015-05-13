import json

# Import flask and template operators
from flask import Flask, render_template

# Import DertaBursies
import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

# Import Login / Security
from flask.ext.security import Security

#from app.security.models import PampleRethinkDatastore, PampleRethinkUserDatastore

# Define the WSGI application object
app = Flask(__name__)

# Configurations
app.config.from_object('configgypuddin')

# Define the database object which is imported
# by modules and controllers
db = r.db('pample')

from flask import g
from flask_security.datastore import Datastore, UserDatastore

class PampleRethinkDatastore(Datastore):
  def put(self, model):
    if model.id is None:
      rv = self.db.table(model.table).insert(model.serialize(False)).run(g.conn)
    else:
      rv = self.db.table(model.table).insert(model.serialize(True)).run(g.conn)
    generatedKey = rv["generated_keys"][0]
    model.id = generatedKey
    return model

  def delete(self, model):
    self.db.table(model.table).delete(model.id)

class PampleRethinkUserDataStore(PampleRethinkDatastore, UserDatastore):
  def __init__(self, db, user_model, role_model):
    PampleRethinkDatastore.__init__(self, db)
    UserDatastore.__init__(self, user_model, role_model)

  def get_user(self, identifier):
    count = self.db.table('users').filter({'email': identifier}).count().run(g.conn)
    if count > 0:
      user = self.db.table('users').filter({'email': identifier}).nth(0).run(g.conn)
      return self.objectify_user(user)
    else:
      return None

  def find_user(self, **kwargs):
    conn = connection()
    count = self.db.table('users').filter(kwargs).count().run(conn)
    if count > 0:
      user = self.db.table('users').filter(kwargs).nth(0).run(conn)
      return self.objectify_user(user)
    else:
      return None

  def find_role(self, role):
    conn = connection()
    count = self.db.table('role').filter({'name': role}).count().run(conn)
    if count > 0:
      role = self.db.table('role').filter({'name': role}).nth(0).run(conn)
      return self.objectify_role(role)
    else:
      return None

  def objectify_user(self, usersan):
    user = User(usersan["email"], usersan["password"], usersan["is_active"], usersan["roles"])
    user.id = usersan["id"]
    return user

  def objectify_role(self, rolesan):
    role = Role(rolesan["name"], rolesan["description"])
    return role

from app.auth.models import User, Role
user_datastore = PampleRethinkUserDataStore(db, User, Role)
securityShh = Security(app, user_datastore)

# index
@app.route('/')
def index():
  #user_datastore.get_user("johnny@email.com")
  return render_template("splash.html")

# catch all those other paths
@app.route('/<path:path>')
def page_no_exist(path):
  return 'clever 404 for www.kermpany.com/%s' % path


RDB_HOST = 'localhost'
RDB_PORT = 28015
RDB_DB = 'pample'

def connection():
  return r.connect(host=RDB_HOST, port=RDB_PORT, db=RDB_DB)



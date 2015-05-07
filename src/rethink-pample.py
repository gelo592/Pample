import argparse
import json
import os
import datetime

from flask import Flask, g, jsonify, render_template, request, abort

import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

from flask.ext.cors import CORS  # The typical way to import flask-cors
#from flask.ext.login import LoginManager, UserMixin, login_required

from flask_wtf import Form
from wtforms import StringField, PasswordField, validators, SubmitField
from wtforms.validators import InputRequired

from flask_peewee.db import Database
from peewee import *
from flask.ext.security import Security, PeeweeUserDatastore, \
    UserMixin, RoleMixin, login_required

app = Flask(__name__)

################################    CONFIGGY PUDDING    ################################

app.config['DATABASE'] = {
    'name': 'example.db',
    'engine': 'peewee.SqliteDatabase',
}
app.config['SECURITY_REGISTERABLE'] = True
app.config['SECURITY_SEND_REGISTER_EMAIL'] = False
app.config['SECURITY_PASSWORD_HASH'] = 'bcrypt'
app.config['SECURITY_PASSWORD_SALT'] = 'somelongrandomhashythingright??'
app.config['SECURITY_REGISTER_URL'] = '/signmeup'
app.config['SECURITY_POST_LOGIN_VIEW'] = '/pamps'
app.config['SECURITY_POST_LOGOUT_VIEW'] = '/aligator'
app.config['SECURITY_POST_REGISTER_VIEW'] = '/pamps'
app.config['SECURITY_UNAUTHORIZED_VIEW'] = '/neeeoooope'

########################################################################################

RDB_HOST = 'localhost'
RDB_PORT = 28015
RDB_DB = 'pample'

cors = CORS(app)

##################################    USERDATASTORE    ##################################
db = Database(app)

class Role(db.Model, RoleMixin):
  name = CharField(unique=True)
  description = TextField(null=True)

class User(db.Model, UserMixin):
  email = TextField(unique=True)
  password = TextField()
  active = BooleanField(default=True)
  confirmed_at = DateTimeField(null=True)

class UserRoles(db.Model):
  # Because peewee does not come with built-in many-to-many
  # relationships, we need this intermediary class to link
  # user to roles.
  user = ForeignKeyField(User, related_name='roles')
  role = ForeignKeyField(Role, related_name='users')
  name = property(lambda self: self.role.name)
  description = property(lambda self: self.role.description)

# Setup Flask-Security
user_datastore = PeeweeUserDatastore(db, User, Role, UserRoles)
security = Security(app, user_datastore)

###############################    DEALING W DERTA    ###############################


#init the DB (probs do just once, ya know?)
def itsDBtime():
  connection = r.connect(host=RDB_HOST, port=RDB_PORT)
  try:
    r.db_create(RDB_DB).run(connection)
    r.db(RDB_DB).table_create('peeps').run(connection)
    r.db(RDB_DB).table_create('vocab').run(connection)
    r.db(RDB_DB).table_create('dico').run(connection)
    r.db(RDB_DB).table_create('users').run(connection)
    print 'Database setup completed. Now run the app without --setup.'
  except RqlRuntimeError:
    print 'App database already exists. Run the app without --setup.'
  finally:
    connection.close()

#with each request connect to the dertaburse
@app.before_request
def before_request():
  try:
    g.rdb_conn = r.connect(host=RDB_HOST, port=RDB_PORT, db=RDB_DB)
  except RqlDriverError:
    abort(503, "No database connection could be established.")

#and clean up when you are done you slob
@app.teardown_request
def teardown_request(exception):
  try:
    g.rdb_conn.close()
  except AttributeError:
    pass

####################################    ROUTES    ####################################

@app.route('/')
def index():
  return render_template("splash.html")

@app.route('/pamps')
def hello_world():
  return 'Hello World!'

@app.route('/pamps/<username>')
@login_required
def show_alien_bio(username):
  return 'alien codename %s' % username

@app.route('/aligator')
def after_logout():
  return 'Later!'

@app.route('/peep/dump')
@login_required
def dump_some_peeps():
  peeple_data = objectify_peeple()
  return render_template("peeeep.html", peeple_data=peeple_data)

@app.route('/peep/add', methods=['GET', 'POST'])
def add_some_peeps():
  error = None
  if request.method == 'POST':
    print "yo"
    db_add_peep(request.form["name"])
    return request.form["name"]
  print "hi"
  return render_template("new_peeple.html")

# catch all those other paths
@app.route('/<path:path>')
def page_no_exist(path):
  return 'clever 404 for www.kermpany.com/%s' % path


################################    VIEW MODELING    ################################

def objectify_peeple():
  peeps = []
  for peepson in r.table('peeps').run(g.rdb_conn):
     peeps += [peepson["name"]]
  return peeps

def objectify_vocab():
  vocab = []
  for word in r.table('vocab').run(g.rdb_conn):
     vocab += [word["word"]]
  return peeps

def objectify_dico():
  dico = []
  for word in r.table('dico').run(g.rdb_conn):
    dico += [word["word"]]
  return dico

##################################    DB SMACK    ##################################

def db_add_peep(name):
  r.table('peeps').insert({"name":name}).run(g.rdb_conn)

def db_add_vocab(dico_id):
  seen = datetime.date.today().__str__()
  r.table('peeps').insert({"peep_id": peep_id, "dico_id": dico_id, "first_seen": seen, "last_seen":  seen, "seen_count": 1}).run(g.rdb_conn)

def db_add_dico(word, defn):
  r.table('peeps').insert({"word": word, "definition": defn}).run(g.rdb_conn)

#################################    CLASS DEFS    #################################

class LoginForm(Form):
  username = StringField('username', [validators.Length(min=6, max=120), validators.Email(), InputRequired()])
  password = PasswordField('password', [validators.Length(min=10, max=120), InputRequired()])
  login = SubmitField('login')
  create = SubmitField('create')

  def validate(self):
    rv = Form.validate(self)
    if not rv:
        return False

    user = r.table('peeps').filter({name: self.username.data})
    if user is None:
        self.username.errors.append('Unknown username')
        return False

    if not user.check_password(self.password.data):
        self.password.errors.append('Invalid password')
        return False

    self.user = user
    return True

####################################################################################

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Run the Flask todo app')
  parser.add_argument('--setup', dest='run_setup', action='store_true')
  parser.add_argument('--kermpany', dest='not_a_test', action='store_true')

  args = parser.parse_args()
  if args.run_setup:
    itsDBtime()
  else if args.not_a_test:
    app.secret_key = '7364626^5@7468696/672"7265[161?><><179207365637]6574}420646 secret secret secret 2069&#2!66$1747$65$22?7pp<>86174206920707574206865726530'
    app.run(host='0.0.0.0')
  else:
    app.secret_key = '7364626^5@7468696/672"7265[161?><><179207365637]6574}420646 secret secret secret 2069&#2!66$1747$65$22?7pp<>86174206920707574206865726530'
    app.run(host='localhost', debug=True)

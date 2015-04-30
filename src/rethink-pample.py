import argparse
import json
import os

from flask import Flask, g, jsonify, render_template, request, abort
app = Flask(__name__)

import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

RDB_HOST = '52.24.2.218'
RDB_PORT = 28015
RDB_DB = 'pample'


#init the DB (probs do just once, ya know?)
def itsDBtime():
  connection = r.connect(host=RDB_HOST, port=RDB_PORT)
  try:
    r.db_create(RDB_DB).run(connection)
    r.db(RDB_DB).table_create('peeps').run(connection)
    r.db(RDB_DB).table_create('vocab').run(connection)
    r.db(RDB_DB).table_create('dico').run(connection)
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

@app.route('/')
def index():
  return "boop bop"

@app.route('/splash')
def splash():
  return render_template("splash.html")

@app.route('/pamps')
def hello_world():
  return 'Hello World!'

@app.route('/pamps/<username>')
def show_alien_bio(username):
  return 'alien codename %s' % username

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Run the Flask todo app')
  parser.add_argument('--setup', dest='run_setup', action='store_true')

  args = parser.parse_args()
  if args.run_setup:
    itsDBtime()
  else:
    app.run(host='0.0.0.0', debug=True)
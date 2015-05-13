import rethinkdb as r
from rethinkdb.errors import RqlRuntimeError, RqlDriverError

from flask import g

from app import app

RDB_HOST = 'localhost'
RDB_PORT = 28015
RDB_DB = 'pample'

# init the DB (probs do just once, ya know?)
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

# with each request connect to the dertaburse
@app.before_request
def before_request():
  try:
    g.conn = r.connect(host=RDB_HOST, port=RDB_PORT, db=RDB_DB)
  except RqlDriverError:
    abort(503, "No database connection could be established.")

# and clean up when you are done you slob
@app.teardown_request
def teardown_request(exception):
  try:
    g.conn.close()
  except AttributeError:
    pass

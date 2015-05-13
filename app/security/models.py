from flask import g
from flask_security.datastore import Datastore, UserDatastore

class PampleRethinkDatastore(Datastore):
  def put(self, model):
    rv = self.db.table(model.table).insert(model).run(g.conn)
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
    return self.db.table('users').filter({'email': identifier}).run(g.conn)

  def find_user(self, **kwargs):
    return self.db.table('users').filter(kwargs).run(g.conn)

  def find_role(self, role):
    return self.db.table('role').filter({'name': role}).run(g.conn)

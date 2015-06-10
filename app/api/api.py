from flask import g
from app import r
import unicodedata

def getUser(user_id):
  return r.db('pample').table('users').get(user_id).run(g.conn)

def getLevel(level_id):
  dertaCursor = r.db('pample').table('levels').filter({'level': level_id}).run(g.conn)
  for derta in dertaCursor:
    print derta
    derta = deunicodify(derta)
    print "hi"
    print derta
    return derta

def deunicodify(object):
  for key in object.keys():
    value = object[key]
    del object[key]
    newKey = unicodedata.normalize('NFKD', key).encode('ascii','ignore')
    print newKey
    object[newKey] = value
  return object
from flask import g, jsonify, request
from flask.ext.security import login_required
from app import r, app
import unicodedata

def getUser(user_id):
  return r.db('pample').table('users').get(user_id).run(g.conn)

@app.route('/api/level')
@login_required
def getLevel():
  print "rawwwwrarwrwarwawrawrrrrrrr"
  level_id = request.args.get('level')
  print level_id
  dertaCursor = r.db('pample').table('levels').get_all(int(level_id), index='level').run(g.conn)
  print dertaCursor
  for derta in dertaCursor:
    print derta
    #derta = deunicodify(derta)
    print "hi"
    print jsonify(derta)
    return jsonify(derta)

def deunicodify(object):
  for key in object.keys():
    value = object[key]
    del object[key]
    newKey = unicodedata.normalize('NFKD', key).encode('ascii','ignore')
    print newKey
    object[newKey] = value
  return object
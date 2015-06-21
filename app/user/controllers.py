from app import app

from flask import render_template
from flask.ext.security import login_required, current_user
from ..api.api import getUser, getLevel

@login_required
@app.route('/pamps')
def pamps():
  user = getUser(current_user.id)
  level = user["currentLevel"]
  return render_template("pamps.html", level=level, user ="GeeEee")

#need to verify it's the right user
@login_required
@app.route('/pamps/<username>')
def alienCommandCentral(username):
  return render_template("command-central.html", user=username)

@app.route('/alligator')
def alligator():
  return render_template("alligator.html")

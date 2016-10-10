from app import app

from flask import render_template, g, redirect
from flask.ext.security import login_required, current_user
from ..api.api import getUser, getLevel

@app.route('/pamps')
@login_required
def pamps():
  """return "how'd you get this url?! pample isn't ready yet. come back soon!" """
  print current_user
  user = getUser(current_user.id)
  level = user["currentLevel"]
  name = user["name"]
  return render_template("pamps.html", level=level, user=name)

#need to verify it's the right user
@app.route('/pamps/<username>')
@login_required
def alienCommandCentral(username):
  return render_template("command-central.html", user=username)

@app.route('/alligator')
def alligator():
  return render_template("alligator.html")
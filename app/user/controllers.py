from app import app

from flask import render_template
from flask.ext.security import login_required

@login_required
@app.route('/pamps')
def pamps():
  return render_template("pamps.html", user ="GeeEee")

#need to verify it's the right user
@login_required
@app.route('/pamps/<username>')
def alienCommandCentral(username):
  return render_template("command-central.html", user=username)

@app.route('/alligator')
def alligator():
  return render_template("alligator.html")

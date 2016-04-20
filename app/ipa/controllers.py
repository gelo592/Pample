from app import app

from flask import render_template

import requests


@app.route('/eye-pee-eh')
def learnIPA():
  print "im heare"
  return render_template("ipa-learnorator/ipa-base.html")

@app.route('/api/getword/<word>')
def getWord(word):
  key = app.config['DICTIONARY_API_KEY']
  url = "http://api.wordnik.com/v4/word.json/%s/audio/?api_key=%s" % (word,  key)
  r = requests.get(url)
  print r
  return r.content



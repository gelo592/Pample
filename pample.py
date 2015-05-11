# Run a test server.
from app import app
from dbsetup import itsDBtime

import argparse

parser = argparse.ArgumentParser(description='Run the Flask todo app')
parser.add_argument('--setup', dest='run_setup', action='store_true')
parser.add_argument('--kermpany', dest='not_a_test', action='store_true')

args = parser.parse_args()
if args.run_setup:
  itsDBtime()
elif args.not_a_test:
  app.config.from_object('configgypuddin')
else:
  app.config.from_object('configgypuddin-example')

app.run()
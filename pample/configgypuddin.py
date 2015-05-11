# Statement for enabling the development environment
DEBUG = False

HOST='0.0.0.0'

PORT=80

# Define the application directory
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = "something long and secret that you won't be able to guess cause that would make it worthless."

DATABASE =  {
    'name': 'pample.db',
    'engine': 'peewee.SqliteDatabase',
  }

SECURITY_REGISTERABLE = True
SECURITY_SEND_REGISTER_EMAIL = False
SECURITY_PASSWORD_HASH = 'bcrypt'
SECURITY_PASSWORD_SALT = 'somelongrandomhashythingright??'
SECURITY_REGISTER_URL = '/signmeup'
SECURITY_POST_LOGIN_VIEW = '/pamps'
SECURITY_POST_LOGOUT_VIEW = '/aligator'
SECURITY_POST_REGISTER_VIEW = '/pamps'
SECURITY_UNAUTHORIZED_VIEW = '/neeeoooope'
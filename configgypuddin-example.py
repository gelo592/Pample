# Statement for enabling the development environment
DEBUG = True

HOST='localhost'

PORT=5000

# Define the application directory
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = "something long and secret that you won't be able to guess cause that would make it worthless."

SECURITY_REGISTERABLE = True
SECURITY_SEND_REGISTER_EMAIL = False
SECURITY_PASSWORD_HASH = 'bcrypt'
SECURITY_PASSWORD_SALT = 'somelongrandomhashythingright??'
SECURITY_REGISTER_URL = '/signmeup'
SECURITY_POST_LOGIN_VIEW = '/pamps'
SECURITY_POST_LOGOUT_VIEW = '/alligator'
SECURITY_POST_REGISTER_VIEW = '/pamps'
SECURITY_UNAUTHORIZED_VIEW = '/neeeoooope'
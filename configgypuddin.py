# Statement for enabling the development environment
DEBUG = False

HOST='0.0.0.0'

PORT=80

# Define the application directory
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = "qnciqAGYEtbqI&eN&ZmhAx*wXRmrNpUSMTwL$$T7zidGQMZO7fc^b9c*qIOUBQojrGpCmZoan^CvN0Q3VA^6HViDPogBP@bh43^n"

SECURITY_REGISTERABLE = True
SECURITY_SEND_REGISTER_EMAIL = False
SECURITY_PASSWORD_HASH = 'bcrypt'
SECURITY_PASSWORD_SALT = '3LJnKViNB9JsGduoK43LS9^X7zLQ!Xk2cG&QQU86WcMDjqAxhjMVEeC6Qr!vI5602@CktO$27RiC!z'
SECURITY_REGISTER_URL = '/signmeup'
SECURITY_POST_LOGIN_VIEW = '/pamps'
SECURITY_POST_LOGOUT_VIEW = '/alligator'
SECURITY_POST_REGISTER_VIEW = '/pamps'
SECURITY_UNAUTHORIZED_VIEW = '/neeeoooope'
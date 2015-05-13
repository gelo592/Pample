from app import db
from flask.ext.security import UserMixin, RoleMixin

class Role(RoleMixin):
  name = None
  description = None
  table = 'roles'
  id = None

  def __init__(self, name, description):
    self.name = name
    self.description = description

  def serialize(self, has_id):
    if has_id:
      return {"name": self.name, "description": self.description, "id": self.id}
    else:
      return {"name": self.name, "description": self.description}

class User(UserMixin):
  email = None
  password = None
  active = True
  confirmed_at = None
  table = 'users'
  roles = []
  id = None

  def __init__(self, email, password, active, roles):
    if not self.validate(email, password): raise ValueError
    self.email = email
    self.password = password
    self.active = active
    self.roles = roles

  def serialize(self, has_id):
    if has_id:
      return {"email": self.email, "password": self.password, "is_active": self.active, "roles": self.roles, "id": self.id}
    else:
      return {"email": self.email, "password": self.password, "is_active": self.active, "roles": self.roles}


  def validate(self, email, password):
    #check email is unique
    #check password is 'strong'
    return True
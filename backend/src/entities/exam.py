from sqlalchemy import Column, String
from .entity import Entity, Base

class Exam(Entity, Base):
    __tablename__ = 'TimeSimTransIsoMat_first_step'

    title = Column(String(32))
    description = Column(String(32))
    
    def __init__(self, title, description, created_by):
        Entity.__init__(self, created_by)
        self.title = title
        self.description = description

from .entities.entity import Session, engine, Base
from .entities.exam import Exam

# python -m src.main

# generate databae schema
Base.metadata.create_all(engine)

# start session
session = Session()

# check for existing data
timeSim = session.query(Exam).all()

if len(timeSim) == 0:
    pytthon_exam = Exam("SQLAlchemy Exam", "Test.",created_by="HTTP")
    session.add(pytthon_exam)
    session.commit()
    session.close()

    #reload
    timeSim = session.query(Exam).all()

#show existing
print('###Exam')
for exam in timeSim:
    print(f'({exam.id}) {exam.title} - {exam.description}')
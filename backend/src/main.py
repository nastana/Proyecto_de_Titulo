#from flask.globals import session
#from sqlalchemy import schema
#from .entities.entity import Session, engine, Base
#from .entities.exam import Exam, ExamSchema
from flask import Flask, jsonify, request, flash
from flask_mysqldb import MySQL
from flask_cors import CORS
# python -m src.main

# creating the Flask application
app = Flask(__name__)

# New begin

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Manimanito110997'
app.config['MYSQL_DB'] = 'proyecto-v01'
mysql= MySQL(app)
  
CORS(app)
# settings
app.secret_key = "110997"

@app.route('/')
def Index():
    return '<h1>Hello world<h1>'

@app.route('/Input_data', methods =['POST'])
def input_data():
    #print(request.json)
    n_transmitter = request.json['n_transmitter'],
    n_receiver = request.json['n_receiver'],
    distance = request.json['distance'],
    plate_thickness = request.json['plate_thickness'],
    porosity = request.json['porosity'],
    #result_step_01 = request.json['result_step_01']
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO timesimtransisomat_first_step01 (n_transmitter, n_receiver, distance, plate_thickness, porosity) VALUES (%s,%s,%s,%s,%s)", (n_transmitter, n_receiver, distance, plate_thickness, porosity))
    mysql.connection.commit()
    flash('data Added successfully')
    return 'input data'

@app.route('/Load_data', methods = ['GET'])
def load_data():
    data_t = []
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM timesimtransisomat_first_step01')
    data = cur.fetchall()
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'n_transmitter': doc[1],
            'n_receiver': doc[2],
            'distance': doc[3],
            'plate_thickness': doc[4],
            'porosity': float(doc[5])
        })
    return jsonify(data_t)
    #print (data)
@app.route('/load_result/<id>', methods=['PUT'])
def load_result_id(id):
    sub_id = id
    result_step_01 = request.json('result_step_01')
    cur = mysql.connection.cursor()
    cur.execute("UPDATE timesimtransisomat_first_step01 SET (result_step_01) VALUES(%s,%s) WHERE id = (sub_id) ", (result_step_01, sub_id))
    mysql.connection.commit()
    return 'jaja'
@app.route('/Advance_control')
def advance_control():
    return 'test'

@app.route('/Result')
def result():
    return 'result'

def test(n_transmitter, n_receiver, distance, plate_thickness, porosity):
    print("n_transmitter: {n_transmitter} \n \
        n_receiver: {n_receiver} \n \
            distance: {distance} \n \
                plate_thickness: {plate_thickness} \n \
                    porosity: {porosity}")


if __name__ == '__main__':
    app.run(port = 3000, debug = True)



# generate databae schema
'''Base.metadata.create_all(engine)

# Test 
#class Task(Model): 
#    id =


# start session
@app.route('/exams')
def get_exams():
    session = Session()
    exam_objects = session.query(Exam).all()

    # transforming into JSON-serializable objects
    
    schema = ExamSchema(many = True)
    exams = schema.dump(exam_objects)

    # serializing as JSON
    session.close()
    return jsonify(exams.data)

@app.route('/exams', methods=['POST'])
def add_exam():
    # mount exam object
    #posted_exam = ExamSchema(only=('title', 'description'))\
    #    .load(request.get_json())
    title = request.json['title']
    description = request.json['description']
    
    exam = Exam(title, description, created_by="HTTP")

    # persist exam
    session = Session()
    session.add(exam)
    session.commit()

    # return created exam
    #new_exam = ExamSchema().dump(exam).data
    session.close()
    return ExamSchema().jsonify(exam), 201

"""session = Session()"""
# check for existing data
"""timeSim = session.query(Exam).all()

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
    print(f'({exam.id}) {exam.title} - {exam.description}')"""'''
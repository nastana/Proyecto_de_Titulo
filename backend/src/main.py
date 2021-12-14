#from flask.globals import session
#from sqlalchemy import schema
#from .entities.entity import Session, engine, Base
#from .entities.exam import Exam, ExamSchema
from flask import Flask, jsonify, request, flash
from flask.wrappers import Response
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
#from flask.ext.cors import CORS, cross_origin
#import función_test as ft
import base64
import sys
#sys.path.insert(0, 'Reidmen Fenics/ipnyb propagation')
#from TimeSimTransIsoMatCij2D_test import fmain
# python -m src.main

# creating the Flask application
app = Flask(__name__)

# New begin

# app.use()


app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Manimanito110997'
app.config['MYSQL_DB'] = 'proyecto-v01'
app.config['CORS_HEADERS'] = 'Content-Type'
mysql = MySQL(app)

CORS(app)
#, resouces={r"/*": {"origins": "*"}}, supports_credentials = True
#cors = CORS(app, resources={r"/*": {"origins": "*"}})


# settings
app.secret_key = "110997"

# @app.after_request
# def after_request(response):
#     response.headers["Access-Control-Allow-Origin"] = "*" # <- You can change "*" for a domain for example "http://localhost"
#     response.headers["Access-Control-Allow-Credentials"] = "true"
#     response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
#     response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
#     return response



@app.route('/')
def Index():
    return '<h1>Hello world<h1>'


@app.route('/Input_data', methods=['POST'])
def input_data():
    #print(request.json['status'])
    #print(request)
    n_transmitter = request.json['n_transmitter'],
    n_receiver = request.json['n_receiver'],
    distance = request.json['distance'],
    plate_thickness = request.json['plate_thickness'],
    porosity = request.json['porosity']
    status = request.json['status']
    #result_step_01 = request.json['result_step_01']
    cur = mysql.connection.cursor()
    # print(porosity)
    #plus = ft.sum(porosity)
    cur.execute("INSERT INTO timesimtransisomat_first_step01 (n_transmitter, n_receiver, distance, plate_thickness, porosity, p_status) VALUES (%s,%s,%s,%s,%s,%s)",
                (n_transmitter, n_receiver, distance, plate_thickness, porosity, status))
    print(cur.lastrowid)
    last_id = cur.lastrowid
    mysql.connection.commit()
    flash('data Added successfully')
    return 'vamo chile'


@app.route('/Load_data', methods=['GET'])
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
            'porosity': float(doc[5]),
            'p_status' : doc[7]
        })
    return jsonify(data_t)


@app.route('/Load_data/<id>', methods=['GET'])
def load_data_id(id):
    #print(request)
    data_t = []
    sub_id = id
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM timesimtransisomat_first_step01 WHERE id = {0}".format(sub_id))
    data = cur.fetchall()
    print(data)
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'n_transmitter': doc[1],
            'n_receiver': doc[2],
            'distance': doc[3],
            'plate_thickness': doc[4],
            'porosity': float(doc[5]),
            #'resul_step_01': doc[6].decode("utf-8"),
            'p_status' : doc[7]
        })
    return jsonify(data_t)
    #print (data)

@app.route('/Load_data/porosity/<v>', methods=['GET'])
def load_data_porosity(v):
    #print(request)
    print(v)
    data_t = []
    poro = v
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM timesimtransisomat_first_step01 WHERE porosity = {0}".format(poro))
    data = cur.fetchall()
    print(data)
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'n_transmitter': doc[1],
            'n_receiver': doc[2],
            'distance': doc[3],
            'plate_thickness': doc[4],
            'porosity': float(doc[5]),
            'p_status' : doc[7]
        })
    return jsonify(data_t)
    #print (data)

@app.route('/Load_data/distance/<v>', methods=['GET'])
def load_data_distance(v):
    #print(request)
    print(v)
    data_t = []
    distance = v
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM timesimtransisomat_first_step01 WHERE distance = {0}".format(distance))
    data = cur.fetchall()
    print(data)
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'n_transmitter': doc[1],
            'n_receiver': doc[2],
            'distance': doc[3],
            'plate_thickness': doc[4],
            'porosity': float(doc[5]),
            'p_status' : doc[7]
        })
    return jsonify(data_t)
    #print (data)



#@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/load_data_PUT/<id>', methods=['PUT'])
def load_result_id_put(id):
    sub_id = id
    #result_step_01 = request.json('result_step_01')
    #print(request)
    #print(request.json)
    #print(request.json['n_transmitter'])
    # response = flask.jsonify({'some': 'data'})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    #print(request.json['n_transmitter'])
    n_transmitter = request.json['n_transmitter']
    n_receiver = request.json['n_receiver']
    distance = request.json['distance']
    plate_thickness = request.json['plate_thickness']
    porosity = request.json['porosity']
    
    #status = "in_Progress"
    # #print(n_transmitter, n_receiver, distance, plate_thickness, porosity)
    cur = mysql.connection.cursor()
    # #cur.execute("UPDATE timesimtransisomat_first_step01 SET (result_step_01) VALUES(%s,%s) WHERE id = (sub_id) ", (result_step_01, sub_id))
    cur.execute("UPDATE timesimtransisomat_first_step01 SET p_status = 'In progress'  WHERE id = {0};".format(sub_id))
    mysql.connection.commit()
    #simulacion(sub_id)
    #ft.sum(porosity)
    ts.fmain(n_transmitter,n_receiver,distance,plate_thickness,porosity)
    
    
    #cur.execute("UPDATE timesimtransisomat_first_step01 SET porosity = {0}, n_transmitter = {1}, n_receiver = {2}, distance = {3}, plate_thickness = {4}  WHERE id = {5};".format(
    #     plus, n_transmitter, n_receiver, distance, plate_thickness, sub_id))
    
    return 'Funciona'


@app.route('/test/<id>', methods=['PUT'])
def advance_control(id):
    sub_id = id
    result_step_01 = request.files['result_step_01']
    #with open('Reidmen Fenics/ipnyb propagation/Files_mat/TimeSimP6TransIsoW1.0M350', 'rb') as f:
    #    blob = base64.b64encode(f.read())
    #file = open('Reidmen Fenics/ipnyb propagation/Files_mat/TimeSimP6TransIsoW1.0M350','rb').read()  
    file = result_step_01.read()
    # We must encode the file to get base64 string
    blob = base64.b64encode(file)
    cur = mysql.connection.cursor()
    # #cur.execute("UPDATE timesimtransisomat_first_step01 SET (result_step_01) VALUES(%s,%s) WHERE id = (sub_id) ", (result_step_01, sub_id))
    cur.execute('UPDATE timesimtransisomat_first_step01 SET result_step_01 = {0}  WHERE id = {1};'.format(blob,sub_id ))
    mysql.connection.commit()
    return 'funcionó'



@app.route('/Result')
def result():
    return 'result'

def simulacion (id):
    sub_id=id
    cur = mysql.connection.cursor()
    cur.execute("UPDATE timesimtransisomat_first_step01 SET p_status = 'test'  WHERE id = {0};".format(sub_id))
    mysql.connection.commit()

def test(n_transmitter, n_receiver, distance, plate_thickness, porosity):
    print("n_transmitter: {n_transmitter} \n \
        n_receiver: {n_receiver} \n \
            distance: {distance} \n \
                plate_thickness: {plate_thickness} \n \
                    porosity: {porosity}")


if __name__ == '__main__':
    app.run(port=3000, debug=True)


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

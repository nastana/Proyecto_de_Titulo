#from flask.globals import session
#from sqlalchemy import schema
#from .entities.entity import Session, engine, Base
#from .entities.exam import Exam, ExamSchema
from datetime import date, datetime
from dis import dis
from http.client import NON_AUTHORITATIVE_INFORMATION
from flask import Flask, jsonify, request, flash
from flask.wrappers import Response
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
import base64
import scipy.io as sio
import shutil
import sys
import os
#sys.path.insert(1, 'Reidmen Fenics/ipnyb propagation')
from dotenv import load_dotenv

load_dotenv()
sys.path.append("Reidmen Fenics/ipnyb propagation")
print(sys.path)
#fmain = __import__("TimeSimTransIsoMatCij2D_test")



#from Reidmen_Fenics.ipnyb_propagation.TimeSimTransIsoMatCij2D_test import fmain
#from TimeSimTransIsoMatCij2D_test import fmain
#from 'Reidmen Fenics'.'ipnyb propagation' import TimeSimTransIsoMatCij2D_test
#from rute import fmain
#import Reidmen Fenics/ipnyb propagation/TimeSimTransIsoMatCij2D_test.py
#exec(open("Reidmen Fenics/ipnyb propagation/TimeSimTransIsoMatCij2D_test.py").read())
# python -m src.main

# creating the Flask application
app = Flask(__name__)

# New begin

# app.use()




""" app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PORT'] =  os.getenv('MYSQL_PORT')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB') # proyecto-v01 para win y proyecto_v01 para linux
app.config['CORS_HEADERS'] = os.getenv('CORS_HEADERS') """

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'simUser'
app.config['MYSQL_PASSWORD'] = 'simPassword'
app.config['MYSQL_PORT'] =  3306
app.config['MYSQL_DB'] = 'proyecto_v02' # proyecto-v01 para win y proyecto_v01 para linux
app.config['CORS_HEADERS'] = 'Content-Type'

mysql = MySQL(app)

CORS(app)
#, resouces={r"/*": {"origins": "*"}}, supports_credentials = True
#cors = CORS(app, resources={r"/*": {"origins": "*"}})


# settings
app.secret_key = "110997"


@app.route('/')
def Index():
    cursor = mysql.connection.cursor()
    print(cursor)
    return '<h1>Hello world<h1>'

@app.route('/Input_data', methods=['POST'])
def input_data():
    name_simulation = request.json['sim_name']
    n_emitters = request.json['n_emitters']
    n_receivers = request.json['n_receivers']
    sens_distance = request.json['sens_distance']
    emitters_pitch = request.json['emitters_pitch']
    receivers_pitch = request.json['receivers_pitch']
    sens_edge_margin = request.json['sens_edge_margin']
    mesh_size = request.json['mesh_size']
    plate_thickness = request.json['plate_thickness']
    sensor_width = request.json['sensor_width'] #Max value = sensor pitch ==> Width <= Pitch

    plate_size = (float(sens_edge_margin) + (int(n_emitters) * float(emitters_pitch)) + float(sens_distance) + ((int(n_receivers)) * float(receivers_pitch)) + float(sens_edge_margin))
    porosity = request.json['porosity']
    attenuation = request.json['attenuation']
    status = request.json['status']
    cod_simulation = '{d:%y}{d.month}{d.day}{d.hour}{d.minute:02}'.format(d=datetime.now())

    cur = mysql.connection.cursor()

    sql = "INSERT INTO SIMULATION (name_simulation, cod_simulation, n_emitter, n_receiver, sensor_distance, emitter_pitch, receiver_pitch, sensor_edge_margin, typical_mesh_size, plate_thickness, plate_size, porosity, attenuation, p_status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
    val = (name_simulation, cod_simulation, n_emitters, n_receivers, sens_distance, emitters_pitch, receivers_pitch, sens_edge_margin, mesh_size, plate_thickness, plate_size, porosity, attenuation, status)
    cur.execute(sql, val)

    print(cur.lastrowid)
    last_id = cur.lastrowid
    mysql.connection.commit()
    cur.close()

    flash('data Added successfully')
    return 'Ok'


@app.route('/Load_data', methods=['GET'])
def load_data():
    data_t = []
    cur = mysql.connection.cursor()
    cur.execute('SELECT ID_SIMULATION, NAME_SIMULATION, DATE_FORMAT(START_DATETIME, "%d-%m-%Y %H:%i:%S "), COD_SIMULATION, N_EMITTER, N_RECEIVER, TYPICAL_MESH_SIZE, PLATE_THICKNESS, PLATE_SIZE, POROSITY, ATTENUATION, P_STATUS FROM SIMULATION')
    data = cur.fetchall()
    cur.close()

    for doc in data:

        status = returnStatus(doc[11])

        data_t.append({
            'id_simulation': doc[0],
            'name_simulation': doc[1],
            'start_datetime': doc[2],
            'cod_simulation': doc[3],
            'n_emitter': doc[4],
            'n_receiver': doc[5],
            'typical_mesh_size': doc[6],
            'plate_thickness': doc[7],
            'plate_size': doc[8],
            'porosity': doc[9],
            'attenuation': doc[10],
            'p_status': status
        })
    return jsonify(data_t)


@app.route('/Load_data/<id>', methods=['GET'])
def load_data_id(id):
    data_t = []
    sub_id = id
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM SIMULATION WHERE ID_SIMULATION = {0}".format(sub_id))
    data = cur.fetchall()
    cur.close()
    for doc in data:

        status = returnStatus(doc[14])

        data_t.append({
            'id_simulation': doc[0],
            'cod_simulation': doc[1],
            'name_simulation': doc[2],
            'n_emitter': doc[3],
            'n_receiver': doc[4],
            'sensor_distance': doc[5],
            'emitter_pitch': doc[6],
            'receiver_pitch': doc[7],
            'sensor_edge_margin': doc[8],
            'typical_mesh_size': doc[9],
            'plate_thickness': doc[10],
            'plate_size': doc[11],
            'porosity': doc[12],
            'attenuation': doc[13],
            'p_status': status,
            'time': doc[15],
            'start_datetime': doc[16],
        })
    return jsonify(data_t)

@app.route('/Load_data/porosity/<v>', methods=['GET'])
def load_data_porosity(v):
    #print(request)
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
    data_t = []
    distance = v
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM timesimtransisomat_first_step01 WHERE distance = {0}".format(distance))
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
    #print (data)

@app.route('/Load_data/download/<v>', methods=['GET'])
def load_data_download(v):
    #print(request)
    cur = mysql.connection.cursor()
    cur.execute("select result_step_01 from timesimtransisomat_first_step01 WHERE id = {0}".format(v))
    datadownload = cur.fetchone()
    datadownload1 = datadownload[0]
    print("aber:", datadownload1)
    # #archivo binary
    shutil.copy("Reidmen Fenics/ipnyb propagation/Files_mat/"+datadownload1, "../../frontend/src/components/download/matfile.mat")
    
    
    return jsonify(datadownload1)
    #print (data)
# def filed(data,filename):
#     with open(filename, 'wb') as f:
#         f.write(data)
# #@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/load_data_PUT/<id>', methods=['PUT'])
def load_result_id_put(id):
    sub_id = id
    
    n_emitters = request.json['n_emitters']
    n_receivers = request.json['n_receivers']
    sens_distance = request.json['sens_distance']

    plate_thickness = request.json['plate_thickness']
    porosity = request.json['porosity']

    cur = mysql.connection.cursor()
    cur.execute("UPDATE SIMULATION SET p_status = '1' WHERE ID_SIMULATION = {0};".format(sub_id))
    mysql.connection.commit()
   
    filename,time = TimeSimTransIsoMatCij2D_test.fmain(n_emitters, n_receivers, sens_distance, plate_thickness, porosity, sub_id)
    print("Nombre archivo",filename)
    # with open(filename,"rb") as d:
    #     datar = d.read()
    # print(type(datar))
    # print(type(time))
    cur = mysql.connection.cursor()
    sql = "INSERT INTO RESULT_MAT (RESULT_STEP_01, ID_SIMULATION) VALUE (%s, %s);"
    cur.execute(sql,(filename, sub_id))
    cur.execute("UPDATE SIMULATION SET time = %s WHERE id = {0};".format(sub_id))
    cur.execute(sql, time)
    mysql.connection.commit()
    cur.close();
    return('Ok')
    
   
@app.route('/Load_data_test/<id>', methods=['GET'])
def load_data_id_test(id):
    data_t = []
    sub_id = id
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM timesimtransisomat_first_step01 WHERE id = {0}".format(sub_id))
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
            'result_step_01': doc[6],
            'p_status' : doc[7],
            'time' : str(doc[8])
        })
    return jsonify(data_t)
    
    
    #cur.execute("UPDATE timesimtransisomat_first_step01 SET porosity = {0}, n_transmitter = {1}, n_receiver = {2}, distance = {3}, plate_thickness = {4}  WHERE id = {5};".format(
    #     plus, n_transmitter, n_receiver, distance, plate_thickness, sub_id))
    
    return 'Funciona'


def returnStatus(status_id):
    status = "Error"
    if(status_id == 0):
        status = "Not Started"
    elif(status_id == 1):
        status = "In Progress"
    elif(status_id == 2):
        status = "Done"
    return status

@app.route('/Result')
def result():
    return 'result'

if __name__ == '__main__':
    app.run(port=3001, debug=False, host="0.0.0.0")

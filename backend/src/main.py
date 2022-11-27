from flask import Flask, jsonify, request, flash, send_file
from flask.wrappers import Response
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
import base64
import scipy.io as sio
import shutil
import sys
import os
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

#Local reference
#dockerRoute = ""

#Docker reference
dockerRoute = "src/"

sys.path.append( dockerRoute + "Reidmen Fenics/ipnyb propagation")

print(sys.path)
Reidmen = __import__("TimeSimTransIsoMatCij2D_test")

# creating the Flask application
app = Flask(__name__)

# New begin

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PORT'] =  int(os.getenv('MYSQL_PORT'))
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['CORS_HEADERS'] = os.getenv('CORS_HEADERS')

mysql = MySQL(app)

CORS(app)

# settings
app.secret_key = "110997"


@app.route('/')
def Index():
    return '<h1>API is Working c:<h1>'

@app.route('/Test')
def test():

    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM timesimtransisomat_first_step01')
    data = cur.fetchall()
    cur.close()
    print('valor de data:', data)
    for item in data:
        print(item)
    return jsonify(results=data)

@app.route('/Input_data', methods=['POST'])
def input_data():

    n_emitters = request.json['n_emitters']
    n_receivers = request.json['n_receivers']
    mesh_size = request.json['mesh_size']
    plate_thickness = request.json['plate_thickness']
    porosity = request.json['porosity']
    status = "Not started"

    isValid, parameter, typeReceived = ValidData(n_emitters, n_receivers, mesh_size, plate_thickness, porosity)
    
    if (isValid):
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO timesimtransisomat_first_step01 (n_transmitter, n_receiver, distance, plate_thickness, porosity, p_status) VALUES (%s,%s,%s,%s,%s,%s)",
                    (n_emitters, n_receivers, mesh_size, plate_thickness, porosity, status))

        last_id = cur.lastrowid
        mysql.connection.commit()

        flash('data Added successfully')
        print('ok')
        return 'ok'
    else:
        flash('Error in data type: ' + parameter)
        print('Error in data type: ' + parameter + '<' + typeReceived + '>')
        return 'Error in data: ' + parameter

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

@app.route('/delete_sim/<id>', methods=['DELETE'])
def delete_sim(id):
    sub_id = id
    cur = mysql.connection.cursor()
    cur.execute(
        "DELETE FROM timesimtransisomat_first_step01 WHERE id = {0}".format(sub_id))
    mysql.connection.commit()
    cur.close()
    return jsonify("DELETE", id)

@app.route('/Load_data/<id>', methods=['GET'])
def load_data_id(id):
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
            'p_status' : doc[7],
            'time' : str(doc[8])
        })
    return jsonify(data_t)

@app.route('/Load_data/porosity/<v>', methods=['GET'])
def load_data_porosity(v):
    data_t = []
    poro = v
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM timesimtransisomat_first_step01 WHERE porosity = {0}".format(poro))
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

@app.route('/Load_data/distance/<v>', methods=['GET'])
def load_data_distance(v):
    #print(request)
    data_t = []
    distance = v
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM timesimtransisomat_first_step01 WHERE distance like '%{0}%'".format(distance))
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

@app.route('/Load_data/download/<v>', methods=['GET'])
def load_data_download(v):
    cur = mysql.connection.cursor()
    cur.execute("select image, result_step_01 from timesimtransisomat_first_step01 WHERE id = {0}".format(v))
    data = cur.fetchone()
    filedata = data[0]
    filename = data[1]
	
    return send_file(BytesIO(filedata), as_attachment = True, download_name = filename, mimetype='mat')


@app.route('/load_data_PUT/<id>', methods=['PUT'])
def load_result_id_put(id):
    sub_id = id
    
    n_transmitter = request.json['n_transmitter']
    n_receiver = request.json['n_receiver']
    distance = request.json['distance']
    plate_thickness = request.json['plate_thickness']
    porosity = request.json['porosity']
    cur = mysql.connection.cursor()
    cur.execute("UPDATE timesimtransisomat_first_step01 SET p_status = 'In progress'  WHERE id = {0};".format(sub_id))
    mysql.connection.commit()
   
  
    filename,time = Reidmen.fmain(n_transmitter,n_receiver,distance,plate_thickness,porosity,sub_id)
    print("Nombre archivo",filename)

    filepath = dockerRoute + "Reidmen Fenics/ipnyb propagation/Files_mat/" + filename
    
    file = read_file(filepath)

    cur = mysql.connection.cursor()
    sql = "UPDATE timesimtransisomat_first_step01 SET result_step_01 = %s, p_status = 'Done', time = %s, image = %s  WHERE id = %s;"
    cur.execute(sql,(filename, time, file, sub_id))
    mysql.connection.commit()

    if os.path.exists(filepath):
        os.remove(filepath)
        print("Archivo temporal removido.")
    else:
        print("No se encuentra el archivo indicado a eliminar.")
        
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

@app.route('/Active_Simulations', methods=['GET'])
def ActiveSims():
    cur = mysql.connection.cursor()
    cur.execute("SELECT count(*) FROM timesimtransisomat_first_step01 where p_status like '%In Progress%'")
    data = cur.fetchone()
    cur.close()
    data_t = {
        "count" : data[0]
    }
    print("Sim in progress:", data[0])
    return jsonify(data_t)

def read_file(filename):
    with open(filename, 'rb') as f:
        matfile = f.read()
    return matfile


@app.route('/Result')
def result():
    return 'result'

def ValidData(n_transmitter, n_receiver, distance, plate_thickness, porosity):


    if(type(n_transmitter) is not int):
        return False, "n_transmitter", str(type(n_transmitter))
    elif(type(n_receiver) is not int):
        return False, "n_receiver", str(type(n_receiver))
    elif(type(distance) is not int and type(distance) is not float):
        return False, "distance", str(type(distance))
    elif(type(plate_thickness) is not int):
        return False, "plate_thinckenss", str(type(plate_thickness))
    elif(type(porosity) is not int and type(porosity) is not float):
        return False, "porosity", str(type(porosity))
    else:
        return True, "", ""

if __name__ == '__main__':
    app.run(port=os.getenv('PORT'), debug=False, host='0.0.0.0')

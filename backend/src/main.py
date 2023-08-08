from flask import Flask, jsonify, request, flash, send_file
from flask.wrappers import Response
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
import base64
import scipy.io as sio
import shutil
import sys
import os
import random
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

#Local reference
#dockerRoute = ""

#Docker reference
dockerRoute = "src/"

sys.path.append( dockerRoute + "Reidmen Fenics/ipnyb propagation")
#sys.path.append("Reidmen Fenics/ipnyb propagation")
print(sys.path)
Reidmen     = __import__("TimeSimTransIsoMatCij2D_test")
ReidmenFreq = __import__("SimFreqDomain2D")

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
    cur.execute('SELECT * FROM simulation')
    data = cur.fetchall()
    cur.close()
    print('valor de data:', data)
    for item in data:
        print(item)
    return jsonify(results=data)

@app.route('/Input_data', methods=['POST'])
def input_data():
    sim_name = request.json['sim_name']
    n_emitters = request.json['n_emitters']
    n_receivers = request.json['n_receivers']
    sens_distance = request.json['sens_distance']
    emitters_pitch = request.json['emitters_pitch']
    receivers_pitch = request.json['receivers_pitch']
    sens_edge_margin = request.json['sens_edge_margin']
    mesh_size = request.json['mesh_size']
    plate_thickness = request.json['plate_thickness']
    porosity = request.json['porosity']       
    attenuation = request.json['attenuation']
    sensor_width = request.json['sensor_width']#pitch
    status = 0

    isValid, parameter, typeReceived = ValidData(n_emitters, n_receivers, emitters_pitch,receivers_pitch,sensor_width,sens_edge_margin,sens_distance,plate_thickness, porosity)
    code_simulation = random.randint(11000, 32434)
    if (isValid):
        plate_length = sens_edge_margin*2 + n_emitters*emitters_pitch +sens_distance+ n_receivers*receivers_pitch
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO simulation (code_simulation, name_simulation, n_transmitter, n_receiver, emitters_pitch, receivers_pitch, sensor_width, sensor_distance, sensor_edge_margin, typical_mesh_size, plate_thickness, plate_length, porosity, attenuation, p_status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (code_simulation, sim_name, n_emitters, n_receivers, emitters_pitch, receivers_pitch, sensor_width, sens_distance, sens_edge_margin, mesh_size, plate_thickness, plate_length, porosity, attenuation, status))
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
    cur.execute('SELECT * FROM simulation ORDER BY id DESC')
    data = cur.fetchall()
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'code_simulation': doc[1],
            'name_simulation': doc[2],
            'n_transmitter': doc[3],
            'n_receiver': doc[4],
            'emitters_pitch': doc[5],
            'receivers_pitch': doc[6],
            'sensor_width': float(doc[7]),
            'sensor_distance': doc[8],
            'sensor_edge_margin': float(doc[9]),
            'typical_mesh_size': doc[10],
            'plate_thickness': doc[11],
            'plate_length': doc[12],
            'porosity': float(doc[13]),
            'attenuation': doc[14],
            'p_status' : doc[16]    
        })
    return jsonify(data_t)

@app.route('/delete_sim/<id>', methods=['DELETE'])
def delete_sim(id):
    sub_id = id
    cur = mysql.connection.cursor()
    cur.execute(
        "DELETE FROM simulation WHERE id = {0}".format(sub_id))
    mysql.connection.commit()
    cur.close()
    return jsonify("DELETE", id)

@app.route('/Load_data/<id>', methods=['GET'])
def load_data_id(id):
    data_t = []
    sub_id = id
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM simulation WHERE id = {0}".format(sub_id))
    data = cur.fetchall()
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'code_simulation': doc[1],
            'name_simulation': doc[2],
            'n_transmitter': doc[3],
            'n_receiver': doc[4],
            'emitters_pitch': doc[5],
            'receivers_pitch': doc[6],
            'sensor_width': float(doc[7]),
            'sensor_distance': doc[8],
            'sensor_edge_margin': float(doc[9]),
            'typical_mesh_size': doc[10],
            'plate_thickness': doc[11],
            'plate_length': doc[12],
            'porosity': float(doc[13]),
            'attenuation': doc[14],
            'p_status' : doc[16]    
        })
    return jsonify(data_t)

@app.route('/Load_data/porosity/<v>', methods=['GET'])
def load_data_porosity(v):
    data_t = []
    poro = v
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM simulation WHERE porosity = {0}".format(poro))
    data = cur.fetchall()
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'code_simulation': doc[1],
            'name_simulation': doc[2],
            'n_transmitter': doc[3],
            'n_receiver': doc[4],
            'emitters_pitch': doc[5],
            'receivers_pitch': doc[6],
            'sensor_width': float(doc[7]),
            'sensor_distance': doc[8],
            'sensor_edge_margin': float(doc[9]),
            'typical_mesh_size': doc[10],
            'plate_thickness': doc[11],
            'plate_length': doc[12],
            'porosity': float(doc[13]),
            'attenuation': doc[14],
            'p_status' : doc[16]    
        })
    return jsonify(data_t)

@app.route('/Load_data/distance/<v>', methods=['GET'])
def load_data_distance(v):
    data_t = []
    distance = v
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT * FROM simulation WHERE distance like '%{0}%'".format(distance))
    data = cur.fetchall()
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'code_simulation': doc[1],
            'name_simulation': doc[2],
            'n_transmitter': doc[3],
            'n_receiver': doc[4],
            'emitters_pitch': doc[5],
            'receivers_pitch': doc[6],
            'sensor_width': float(doc[7]),
            'sensor_distance': doc[8],
            'sensor_edge_margin': float(doc[9]),
            'typical_mesh_size': doc[10],
            'plate_thickness': doc[11],
            'plate_length': doc[12],
            'porosity': float(doc[13]),
            'attenuation': doc[14],
            'p_status' : doc[16]    
        })
    return jsonify(data_t)

@app.route('/Load_data/download/<v>', methods=['GET'])
def load_data_download(v):
    cur = mysql.connection.cursor()
    cur.execute("select image, result_step_01 from simulation WHERE id = {0}".format(v))
    data = cur.fetchone()
    filedata = data[0]
    filename = data[1]
	
    return send_file(BytesIO(filedata), as_attachment = True, download_name = filename, mimetype='mat')


@app.route('/load_data_PUT/<id>', methods=['PUT'])
def load_result_id_put(id):
    sub_id = id    
    n_transmitter = request.json['n_emitters']
    n_receiver = request.json['n_receivers']
    emitters_pitch = request.json['emitters_pitch']
    receivers_pitch = request.json['receivers_pitch']
    sensor_width = request.json['sensor_width']
    sensor_edge_margin = request.json['sens_edge_margin']
    typical_mesh_size = request.json['mesh_size']    
    sensor_distance = request.json['sens_distance']
    plate_thickness = request.json['plate_thickness']
    porosity = request.json['porosity']
    plate_length = request.json['plate_length']
    attenuation = request.json['attenuation']
    cur = mysql.connection.cursor()
    cur.execute("UPDATE simulation SET p_status = 1  WHERE id = {0};".format(sub_id))
    mysql.connection.commit()
   
  
    if(attenuation == 1):
        filename,time = ReidmenFreq.fmain(n_transmitter,n_receiver,sensor_distance, emitters_pitch, receivers_pitch, sensor_edge_margin, typical_mesh_size, plate_thickness, plate_length, sensor_width,porosity,attenuation,sub_id)
    else:
        filename,time = Reidmen.fmain(n_transmitter,n_receiver,sensor_distance, emitters_pitch, receivers_pitch, sensor_edge_margin, typical_mesh_size, plate_thickness, plate_length, sensor_width,porosity,attenuation,sub_id)
    print("Nombre archivo",filename)
    
    filepath = dockerRoute + "Reidmen Fenics/ipnyb propagation/Files_mat/" + filename
    
    print(filepath)
    file = read_file(filepath)

    cur = mysql.connection.cursor()
    sql = "UPDATE simulation SET result_step_01 = %s, p_status = 2, time = %s, image = %s  WHERE id = %s;"
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
        "SELECT * FROM simulation WHERE id = {0}".format(sub_id))
    data = cur.fetchall()
    cur.close()
    for doc in data:
        data_t.append({
            'id': doc[0],
            'code_simulation': doc[1],
            'name_simulation': doc[2],
            'n_transmitter': doc[3],
            'n_receiver': doc[4],
            'emitters_pitch': doc[5],
            'receivers_pitch': doc[6],
            'sensor_width': float(doc[7]),
            'sensor_distance': doc[8],
            'sensor_edge_margin': float(doc[9]),
            'typical_mesh_size': doc[10],
            'plate_thickness': doc[11],
            'plate_length': doc[12],
            'porosity': float(doc[13]),
            'attenuation': doc[14],
            'p_status' : doc[16]    
        })
    return jsonify(data_t)

@app.route('/Active_Simulations', methods=['GET'])
def ActiveSims():
    cur = mysql.connection.cursor()
    cur.execute("SELECT count(*) FROM simulation where p_status = 1")
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

def ValidData(n_transmitter, n_receiver, emitters_pitch, recivers_pitch,sensor_width, sensor_edge, distance, plate_thickness, porosity):


    if(type(n_transmitter) is not int):
        return False, "n_transmitter", str(type(n_transmitter))
    elif(type(n_receiver) is not int):
        return False, "n_receiver", str(type(n_receiver))
    elif(type(emitters_pitch) is not int and type(emitters_pitch) is not float):
        return False, "emitters_pitch", str(type(emitters_pitch))
    elif(type(recivers_pitch) is not int and type(recivers_pitch) is not float):
        return False, "recivers_pitch", str(type(recivers_pitch))
    elif(type(sensor_width) is not int and type(sensor_width) is not float):
        return False, "sensor_width", str(type(sensor_width))       
    elif(type(sensor_edge) is not int and type(sensor_edge) is not float):
        return False, "sensor_edge", str(type(sensor_edge))    
    elif(type(distance) is not int and type(distance) is not float):
        return False, "distance", str(type(distance))
    elif(type(plate_thickness) is not int and type(plate_thickness) is not float):
        return False, "plate_thinckenss", str(type(plate_thickness))
    elif(type(porosity) is not int and type(porosity) is not float):
        return False, "porosity", str(type(porosity))
    else:
        return True, "", ""

if __name__ == '__main__':
    app.run(port=os.getenv('PORT'), debug=False, host='0.0.0.0')

/* CREATE DATABASE BDAT_FE_simulations; */

use BDAT_FE_simulations;

CREATE TABLE IF NOT EXISTS simulation (
  id INT NOT NULL AUTO_INCREMENT,
  code_simulation VARCHAR(255) NOT NULL,  
  name_simulation VARCHAR(255) NOT NULL,
  n_transmitter INT NOT NULL,
  n_receiver INT NOT NULL,
  emitters_pitch FLOAT DEFAULT NULL,
  receivers_pitch FLOAT DEFAULT NULL,  
  sensor_gap FLOAT DEFAULT NULL,
  sensor_distance FLOAT DEFAULT NULL,
  sensor_edge_margin FLOAT DEFAULT NULL,
  typical_mesh_size FLOAT DEFAULT NULL,
  plate_thickness FLOAT DEFAULT NULL,
  plate_length FLOAT DEFAULT NULL,
  porosity DECIMAL(10,0) NOT NULL, 
  attenuation FLOAT DEFAULT NULL, 
  result_step_01 TEXT NULL,
  p_status TEXT NULL,
  start_datetime DATETIME DEFAULT NULL,
  time TIME DEFAULT NULL,
  image LONGBLOB NULL,
  PRIMARY KEY (id)
);


/* INSERT INTO timesimtransisomat_first_step01(
    id, n_transmitter, n_receiver, distance, plate_thickness, porosity, result_step_01, p_status, time, image
  ) VALUES ('1', '2','2','5','2','1', 'TimeSimP2TransIsoW2M14.01.mat', 'Done', '00:00:20', NULL); */


/* CREATE USER 'UserBDAT'@'localhost' IDENTIFIED BY 'BDATpassword';

GRANT ALL PRIVILEGES ON * . * TO 'UserBDAT'@'localhost';

FLUSH PRIVILEGES; */


SELECT * FROM timesimtransisomat_first_step01;
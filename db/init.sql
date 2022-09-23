/* CREATE DATABASE BDAT_FE_simulations; */

use BDAT_FE_simulations;

CREATE TABLE IF NOT EXISTS timesimtransisomat_first_step01 (
  id INT NOT NULL AUTO_INCREMENT,
  n_transmitter INT NOT NULL,
  n_receiver INT NOT NULL,
  distance FLOAT DEFAULT NULL,
  plate_thickness INT NOT NULL,
  porosity DECIMAL(10,0) NOT NULL,
  result_step_01 TEXT NULL,
  p_status TEXT NULL,
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
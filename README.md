#Desarrollo de una interfaz permitiendo el uso fácil de un código de simulación de ondas guiadas por el hueso cortical
_Este proyecto esta centrado en la creación de una interfaz gráfica que de como solución a la utilización de un código de simulación mediante una aplicación web. Este git presenta el desarrollo tanto de frontend como backend lo cual facilita a la hora de organización._

## Comenzando 

Para dar inicio al proyecto es importante entender que este documento corresponde al manual de usuario del proyecto enfocado en la interfaz. El desarrollo junto con la justificación de lo realizado, más datos que respaldan las deciciones de la forma y metodología de desarrollo esta presente en el documento del trabajo de Título al cual este documento esta enlazado.


### Pre-requisitos 

Para poder inicializar este proyecto de manera local primero debemos comenzar con la base de datos para luego conectarla con el backend y poder levantarlo para finalmente levantar el frontend de manera local.
Para ello primero necesitamos fijar o mencionar que como requerimientos minimos que debe presentar el sistema para que la simulación pueda ser ejecutada en un tiempo optimo son las siguientes.

|Componente     |Caracterıstica|
|---------------|--------------|
|Procesador| Intel(R) Core(TM) i5-8265U|
|Memoria RAM| 8Gb|
|Capacidad de almacenamiento| 250 GB|

La simulación mencionada es solo una parte del proyecto general, debido a que este se enfoca en generar una interfaz a dicho código.

### Instalación 

Para poder levantar tanto frontend como backend de manera local primero se debe crear una base de datos con la siguiente estructura

|Field |Type|Null|Key|Default|Extra|
|------|----|----|---|-------|-----|
| id              | int(11)       | NO   | PRI | NULL    | auto_increment |
| n_transmitter   | int(11)       | NO   |     | NULL    |                |
| n_receiver      | int(11)       | NO   |     | NULL    |                |
| distance        | int(11)       | NO   |     | NULL    |                |
| plate_thickness | int(11)       | NO   |     | NULL    |                |
| porosity        | decimal(10,0) | NO   |     | NULL    |                |
| result_step_01  | longblob      | YES  |     | NULL    |                |
| p_status        | text          | YES  |     | NULL    |                |
| time            | float         | YES  |     | NULL    |                |
| image           | blob          | YES  |     | NULL    |                |
Luego de haber creado la base de datos se debe conectar con el backend para ello solo debemos configurar y editar los siguientes parámetros con los adecuados dependiendo de lo establecido en la base de datos creada.

Luego de conectar base de datos con backend se debe descargar todas las dependencias que presenta esta sección. Para ello debemos acceder al entorno virtual mediante Pipenv para luego descargar las dependencias desde el archivo "Pipfile". Esto nos facilita a la hora de la instalación de manera local.

Para instalar todas las dependencias solo se debe ejecutar el siguiente comando:
```
pipenv install
```
Este comando instalará todos las dependencias del backend.

Ahora solo queda levantar los servicios del backend para ello solo se debe iniciar con el siguiente comando.

```
python3 main.py
```
Es importante estar parado en la ruta "/backend".

Una vez levantado el backend solo queda inicializar el frontend para poder levantar todo el proyecto de manera local.
Para ello utilizaremos la consola y nos dirigiremos a la ruta /frontend para luego utilizar

```
npm install
```

Este comando instalará todas las dependencias del frontend mediante NPM el cual maneja los paquetes y dependencias. Una vez instalado solo queda utilizar el siguiente comando:


```
npm start
```
Una vez utilizado se abrirá el navegador con la aplicación levantada de manera local.
## Tecnologías

Las herramientas que se utilizarán para el desarrollo del proyecto junto con su instalación de manera local son las siguientes:

* Docker
* JS
* React
* Python 
* Node


Instalar Node.js
Ingresar a Node.js
Descargar Node.js
Una vez que Node.js está instalado, Ubicarse dentro de la carpeta en que se creará el servidor backend.
En el terminal ejecutar el comando: npm init -y
En el terminal ejecutar el comando: npm install express mongoose cors
Si el terminal NO tiene permisos para ejecutar scripts, le daremos permiso con el siguiente comando: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Posterior a este comando, se puede volder a ejecutar los comandos anteriores.
Para ejecutar la aplicación backend, usamos el siguiente comnado por terminal: node miAplicacion.js





colcoar en terminal de aqi npm install mongodb


#  "packages": { 
    "": {
      "name": "backend",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "body-parser": "^2.2.2",
        "cors": "^2.8.6",
        "express": "^5.2.1",
        "mongoose": "^9.6.2"
      }
    },
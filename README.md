# Node debugging in docker
#### Ejercicio para aprender a hacer debugging de aplicaciones node-js dentro de contenedores docker
#### Created by: Danielo Rodríguez Rivero
#### Keywords: rest,microservice, tutorial

# Lección 04 - Configurable debugging

Hasta ahora hemos estado usando una imagen de docker modificada con el protocolo de debugging habilitado.
Dejar el debugging activado en una imagen en producción es considerado mala práctica, incluso si se mapea el puerto al exterior.
Además,con los últimos cambios en los que utilizamos `--inspect-brk` nuestro programa se queda congelado y no arranca hasta que un debugger se conecta, lo cual lo hace totalmente inservible para producción.
Esto nos obliga a editar y re-compilar la imagen cada vez que queremos hacer debugging o generar una imagen para producción, lo cual no es solo tedioso sino que además es tendente a errores.

Una alternativa más práctica sería cambiar el modo en el que la imagen de docker arranca para hacerla más versátil. 
Normalmente lo que hacemos es configurar la instrucción `CMD` de la imagen de docker para que ejecute un comando cuando se arranque, donde ese comando es nuestro programa.
¿ Y si en lugar de lanzar nuestro programa directamente ejecutamos un script que lanza nuestro programa con distintos parámetros ? 
En ese caso las posibilidades se amplían a lo que nuestra imaginación y habilidades como programadores nos permitan. 
Dependiendo de lo que pretendamos que nuestro script haga debemos configurarlo en `CMD` o en `ENTRYPOINT`. 
Dado que nuestros objetivos son modestos y pretendemos que el script sea simple vamos a limitarnos a utilizarlo con `CMD`.

La tarea consistirá en escribir un script llamado `CMD.sh` en la raíz del repositorio que ejecute nuestro backend con el protocolo de debugging activado **o no** en base a alguna condición que podamos especificar a la hora de ejecutar la imagen. Yo os propongo el uso variable de entorno llamada `DEBUGGING` que pueda tomar los valores `yes` y `no`.

* Debéis construir de nuevo la imagen de docker para que los cambios tengan efecto.
* Después podéis ejecutar el mismo comando que en la lección anterior para probar la nueva imagen.
* Si lo habéis hecho de forma correcta, deberíais ser capaces de arrancar un contenedor con el debugger activado o no cambiando los parámetros que se le pasen a la imagen.

# Solución

Igual que con cualquier otro problema de programación este ejercicio admitía varias soluciones.
A continuación listo algunas posibles soluciones, todas ellas implican la ejecución de un script como punto de entrada a la imagen.

* Script que en función de una variable de entorno ejecute (o no) nuestra aplicación en modo debug
  * Se ejecutará a través de la opción `CMD` de la imagen de docker
  * Este es el método que hemos elegido para resolverlo
  * La ventajas de esta solución son:
    * Proveer variables de entorno a un contenedor es muy fácil
    * La mayoría de orquestadores (ej rancher) admiten configurar variables de entorno de forma sencilla
    * Es muy fácil saltarse la ejecución del `CMD` con aquello que queramos
* Script que en base a un parámetro ( o varios ) ejecute nuestra aplicación en modo debug
    * Se puede lanzar mediante la instrucción `CMD` del Dockerfile
    * La desventajas de este método son:
      * es bastante más complicado pasar parámetros a una imagen
      * corremos el riesgo de sobre-escribir el comando a ejecutar en lugar de pasarle un parámetro
      * no sabemos si los distintos orquestadores admiten pasar parámetros a un contenedor
* Script configurado como `ENTRYPOINT` que admita tanto parámetros como otros comandos a ejecutar
    * Esta solución nos da control total de como se comporta nuestra imagen y es muy flexible
    * No obstante, tiene varias desventajas a tener en cuenta:
      * La complejidad del script es muy alta, puesto que tenemos que tener en cuenta muchas más opciones y posibilidades que nos pueden llegar como parámetro o variables de entorno
      * Lo que se especifique en `CMD` es fácil de sobre-escribir en tiempo de ejecución, el `ENTRYPOINT` no
      * Tenemos que calcular muy bien y de antemano todas las opciones que queramos permitir 


## Commands reference

* `npm run build` en cualquiera de las ramas construye la imagen de docker
* `npm run docker-start` ejecuta el contenedor en modo interactivo (para poder ver los logs). Asegúrate de **construir la imagen primero!**
* `npm start` Start the server 
* `npm run start-dev` Start the server on dev mode 
* `npm test` Run tests 
* `git checkout master` para volver a las instrucciones básicas 
* `git checkout 01-basic-way` para ir a la primera lección
* `git checkout 02-debugging-with-vsc` para ir a la segunda lección
* `git checkout 03-bug-on-startup` para ir a la tercera lección
* `git checkout 04-configurable-debugging` para ir a la cuarta lección
* `git checkout 05-already-running-container` para ir a la quinta lección
* With the server running, open `http://localhost:3000/version` to see the version of your package
* With the server running, open `http://localhost:3000/documentation` to see the documentation of your API

The example microservice that is used for exploring the different scenarios was generated by the [Hapi Swagger ES6 Generator](https://github.com/danielo515/generator-hapi-swagger-es6)

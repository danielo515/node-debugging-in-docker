# Node debugging in docker
#### Ejercicio para aprender a hacer debugging de aplicaciones node-js dentro de contenedores docker
#### Created by: Danielo Rodríguez Rivero
#### Keywords: rest,microservice, tutorial

# Lección 01 - Basic way

En esta lección se ha modificado la imagen de docker para que sea posible adjuntar un proceso de forma externa.
Este método require cambiar la imagen de docker cada vez que se quiere añadir la posibilidad de hacer debugging y de nuevo editarla antes de subirla a producción.
Otra alternativa sería dejar siempre activado el debugging y solo conectarse al mismo en caso de ser necesario, pero esto también se considera una mala práctica.

Debéis construir de nuevo la imagen de docker para que los cambios tengan efecto.
Después podéis ejecutar el mismo comando que en la lección anterior para probar la nueva imagen.

Si lo habéis hecho de forma correcta, deberíais ver una referencia en el log del contenedor, que además os proporciona una URL a la que conectarse para hacer debugging.
Esto es posible gracias a que se utiliza el método `inspect` en lugar del antíguo parámetro `-debug` , el cual está deprecado y no debería ser usado.

Puede que alguno de los parámetros de la imagen de docker no sean del todo correctos. A pesar de ello, en el propio dockerfile hay bastantes pistas para deducir que podría
estar fallando. Es tarea del alumno solucionarlos de ser así.

Una vez se hayan arreglado los posibles fallos en la imagen de docker, es necesario volver a construirla y ejecutarla.

# Solución

El fallo estaba en las opciones del método **inspect**. Por defecto el método **inspect** tan solo está disponible para procesos corriendo **en la misma máquina**.
Este hecho juegan en nuestra contra cuando lo que queremos es hacer debugging en un contenedor de docker el cual que se encuentra aislado en su propio espacio como si de otra máquina se tratase (de hecho en windows se trata de una máquina virtual, por lo que es literalmente así).

Para solucionarlo basta con parametrizar **inspect** con las siguientes opciones:
* `--inspect=0.0.0.0:5858`.
  * `0.0.0.0` indica a node que cualquiera puede conectarse a la consola de debug. 
  * `:5858` le dice a node en que puerto escuchar . Hemos escogido este puerto para demostrar que se puede utilzar uno diferente al estándar que es **9229** 
* Ahora deberemos volver a construir la imagen con `npm run build` y volver a levantarla con `npm run docker-start`.
* Si todo va bien ahora sí deberías poder conectarte a la url que aparece en el log mediante tu navegador Chrome.
  * **NOTA**: puede que en windows debas ajustar la url para apuntar a la ip de la máquina de docker debido a que docker se ejecuta dentro de una máquina virtual.

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

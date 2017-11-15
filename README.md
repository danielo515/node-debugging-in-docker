# Node debugging in docker
#### Ejercicio para aprender a hacer debugging de aplicaciones node-js dentro de contenedores docker
#### Created by: Danielo Rodríguez Rivero
#### Keywords: rest,microservice, tutorial

# Lección 05 - Already running container

Hasta ahora hemos tenido la posibilidad de levantar y parar nuestros contenedores a placer con distintos parámetros y configuraciones.
¿ Pero qué ocurre cuando no tenemos esta posibilidad ? Por ejemplo, un contenedor que lleva ya un tiempo en ejecución sin el protocolo de debug activado 
y necesitamos analizar el comportamiento del código aún cuando no parece haber ningún error evidente, ¿Cómo podemos activar el protocolo de debugging sin recrear el contenedor y por tanto perder el estado que queremos analizar ?

Al contrario que con las otras lecciones, está no tiene una solución evidente ni cae dentro de las habilidades típicas de un desarrollador de `node.js` por lo que no se propone como un ejercicio. 
En su lugar se presenta como un pequeño manual/tutorial/referencia para resolver un problema que no debería ser habitual, pero que puede llegar a darse.
Es por eso que este capítulo se compone tan solo de una rama en la que se presentan tanto el enunciado del problema como un pequeño tutorial de como afrontarlo.

# Solución

La solución le resultará familiar a la mayoría de personas familiarizadas con unix: SIGNALING (señales de procesos)
Afortunadamente node.js entiende algunas señales más allá de las típicas como pueden ser `SIGKILL`. 
La que nos interesa en este caso es `SIGUSR1`, la cual le indica a un proceso de node en ejecución que active el protocolo de debugging , y todo esto en caliente sin necesidad de reiniciar el proceso ¡justo lo que queremos!

Normalmente tendríamos que hacer un `ps -ef` para identificar a qué proceso de node debemos atacar, pero dado que nuestro contenedor de docker (dios los bendiga) es a efectos prácticos una máquina independiente, sólo existe un proceso corriendo que, casualmente (es broma, no es casual), es el nuestro. Por lo tanto, podemos usar un pequeño atajo para hacerlo todo con un único comando:

```bash
kill -s SIGUSR1 $(pidof -s node)
```

La forma de ejecutar esta instrucción variará según el entorno en el que nos encontremos. 
Por ejemplo, en caso de que nuestro contenedor se esté ejecutando en rancher y no tenemos acceso al host en el que corre, la opción más cómoda es abrir una terminal en nuestro container a través de la interfaz web y ejecutar el comando arriba mencionado.
Si tenemos acceso al host (ej, en nuestro equipo) podemos ejecutar la instrucción a través del demonio de docker sin necesidad de levantar una sesión interactiva:

```bash
docker exec -it <containerName> bash -c 'kill -s SIGUSR1 $(pidof -s node)'
```

donde `<containerName>` es el nombre o ID del contenedor objetivo.

Para que no tengáis que copiar-pegar, ni tan siquiera pensar un poco, se provee un **script de npm** para ejecutar la citada instrucción. Ejecutad:

```bash
npm run docker-debug-enable
```

Si examinamos los logs del contenedor que contiene nuestra aplicación veremos un mensage de log indicando que el protocolo de debugging ha sido activado. **¡BIEN!**

```
Debugger listening on ws://127.0.0.1:9229/cf41999d-578e-47dc-8386-03ebf6d6ccfe
For help see https://nodejs.org/en/docs/inspector
Debugger attached.
```

Todo es felicidad, armonía y prosperidad, ahora solo resta conectarnos con VSCode y empezar a hacer debugging...

![Fail image](/images/oops.png)

Vaya, un error, ¡ que inesperado !

Los lectores más avispados/despiertos se habrán dado cuenta de que varias cosas no cuadran en el mensaje de log en el que se nos notificaba que el protocolo de debugging se había activado:

* El puerto **no es** el que nosotros esperábamos, sino el estándar para el protocolo `inspect` (9229)
* Las IPs desde las que se permiten conexiones son `127.0.0.1`, es decir loopback, es decir localhost

El primer problema tiene fácil solución, **cambiamos el puerto** al que atacamos **en nuestra configuración** y listo. Vamos a hacerlo, cambiad la configuración o cread una nueva apuntando al puerto `9229`.<br>
El segundo en cambio, es un poco más duro de roer. Si las únicas conexiones permitidas son desde localhost tenemos un problema. 
Recordemos que, a efectos prácticos, un contenedor de docker es como otra máquina **diferente a la nuestra**, entonces... ¿ cómo conectar de forma remota a un proceso que solo permite conexiones locales ?

La solución a este segundo problema no es obvia, pero afortunadamente tampoco es complicada una vez que la entendemos.
Existe una pequeña utilidad llamada `socat` (socket cat) que puede ayudarnos. Tal y como su nombre indica nos permite **concatenar** (cat) **sockets**. ¡ Justo lo que necesitamos !

Al igual que , a efectos prácticos, un contenedor es una máquina remota, también tenemos a nuestra disposición algunos trucos únicos gracias a docker.
Por ejemplo, podemos levantar un contenedor **en la misma red local** que otro contenedor, ¿veis por dónde vamos?

Vamos a levantar un pequeño contenedor con la herramienta `socat` dentro, vamos a decirle a docker que lo queremos en la misma red que el contenedor de nuestra aplicación, y le diremos a `socat` que nos redirija lo que entre a través del puerto `X` a nuestro proceso de node en `localhost:9229`

Si todo esto os resulta algo confuso con simples palabras, permitidme ilustrarlo con un esquema:

![socat diagram](/images/socat.png)

Para facilitar la vida al lector hemos incluido un dockerfile para generar una imagen con la herramienta `socat` instalada así como algunos scripts de npm para configurar el entorno que vamos a necesitar. Ejecutad los siguientes comandos:

1. `npm run build-socat` para construir la imagen con `socat` a partir de `alpineLinux`
1. `npm run socat-daemon` para levantar un contenedor con `socat` en la misma red que el contenedor con nuestra aplicación. Este será el encargado del port forwarding en la red destino
1. `npm run socat-bridge` para levantar un contenedor de `socat` que hará de puente entre nuestra red y el demonio de `socat` encargado del port forwarding

Tras ejecutar los anteriores comandos, los cuales os insto a analizar detenidamente y en detalle, ya deberíamos ser capaces de conectar con VSCode al debugger "remoto"

:clap: :clap: ¡ VICTORIA ! :clap: :clap:

## Bibliografía

Este capítulo ha sido posible gracias a las instrucciones del siguiente tutorial:

* https://codefresh.io/blog/debug_node_in_docker/

En él se detallan algunas otras técnicas algo más avanzadas y algunos buenos consejos que quedan fuera del scope de este curso. Os recomiendo su lectura.

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

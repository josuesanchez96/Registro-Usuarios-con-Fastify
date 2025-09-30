# Registro de Productos con Fastify

Esta aplicación permite agregar, listar y eliminar productos mediante:

* Un frontend  HTML y JS.
* Una API REST en Fastify con PostgreSQ.

>## Requisitos
>* Node.js 20+
>* Docker Desktop
>* Live Server en Visual Studio Code

## Estructura
<img width="992" height="273" alt="image" src="https://github.com/user-attachments/assets/f3d564fd-0935-40ea-81e7-d13da0fae735" />

## Variables de entorno

Crea el archivo `backend/.env` a partir de `backend/.env.example` y completa tus valores reales.

```ini
# PostgreSQL 
PGHOST=localhost
PGPORT=5432
PGDATABASE=<tu_base_de_datos>
PGUSER=<tu_usuario>
PGPASSWORD=<tu_contraseña>

# Servidor API
PORT=3000
HOST=0.0.0.0
```

> ## Seguridad
> No subir backend/.env al repositorio.
> Incluye solo backend/.env.example.
> Verifica que .gitignore tenga backend/.env.

## Puesta en marcha

## Docker Compose
En la raíz del proyecto, ejecuta:  
```js
docker compose up -d
```

Esto levanta *Postgres* y el *backend*.

## API
La API quedará disponible en: http://localhost:3000

## Frontend

Abre el archivo del frontend:  
Con Live Server: abre frontend/index.html.  
La página usará la API en: http://localhost:3000  

## Uso desde el Frontend

1. Abre la página (index.html).
2. En el formulario, ingresa:
   * Nombre 
   * Precio 
   * Presiona Guardar.
3. La tabla mostrará todos los productos.
4. Para eliminar, pulsa el botón Eliminar en la fila correspondiente.

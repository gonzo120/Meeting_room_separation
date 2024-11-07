# Prueba Técnica Mederi

Este proyecto contiene tanto el frontend como el backend de la prueba técnica. A continuación, se detallan los pasos para instalar y ejecutar ambos componentes utilizando Docker y Docker Compose.

## Requisitos
## Versiones Utilizadas

    - Node.js: v18.19.1
    - Angular CLI: 17.2.0
    - Docker
    - Docker Compose

## Instalación

1. Clona el repositorio:

    ```sh
    git clone https://github.com/tu-usuario/PruebaTecnica_Mederi.git
    cd PruebaTecnica_Mederi
    ```

2. Navega al directorio del backend:

    ```sh
    cd backend
    ```

3. Construye y levanta los contenedores con Docker Compose:

    ```sh
    docker-compose up --build
    ```

4. Accede a la aplicación:

    - Frontend: [http://localhost:4200]
    - Backend: [http://localhost:3000]

## Estructura del Proyecto

- `frontend/`: Contiene el código del frontend.
- `backend/`: Contiene el código del backend.
- `docker-compose.yml`: Archivo de configuración de Docker Compose.

## Comandos Útiles

- Para detener los contenedores:

    ```sh
    docker-compose down
    ```

- Para reconstruir los contenedores sin cache:

    ```sh
    docker-compose build --no-cache
    ```
    
## Instalación del Frontend

Para instalar y ejecutar el frontend de manera independiente, sigue estos pasos:

1. Navega al directorio del frontend:

    ```sh
    cd frontend
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

3. Inicia la aplicación:

    ```sh
    npm run start
    ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).
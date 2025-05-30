# Sistema de Asesorías

Un sistema de asesorías desarrollado en React (.jsx) que permite gestionar, programar y realizar chats en vivo entre alumnos y asesores. La plataforma ofrece funcionalidades para agendar sesiones, llevar el historial de asesorías, compartir materiales y comunicarse en tiempo real a través de un sistema de mensajería intuitivo.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Características

- **Gestión de Usuarios:** Registro e inicio de sesión para alumnos, asesores y administradores.
- **Perfil de Usuario:** Administración de perfiles, incluyendo fotografía (almacenada o referenciada a través de URL).
- **Gestión de Materias y Temas:** Cada materia cuenta con varios temas para especificar áreas de consulta.
- **Agenda de Asesorías:** Sistema para reservar y programar sesiones de asesoría, asignando asesores automáticamente o de manera manual.
- **Chat en Tiempo Real:** Intercambio de mensajes en un chat integrado por cada sesión de asesoría, con validación de remitentes.
- **Historial y Reportes:** Registro del historial de asesorías, con posibilidad de generar reportes y estadísticas de uso.

## Tecnologías Utilizadas

- **React:** La librería principal para la construcción de interfaces de usuario en .jsx.
- **React Router:** Para la navegación y rutas dentro de la aplicación.
- **Redux (o Context API):** Gestión del estado global de la aplicación.
- **Socket.io (o similar):** Comunicación en tiempo real para el chat de asesorías.
- **Axios / Fetch API:** Para consumir la API RESTful que gestiona la lógica del backend.
- **CSS / SASS / Styled Components:** Estilizado de componentes y maquetación responsiva.
- **Node.js & Express:** (Opcional) Para el backend que administra la lógica de negocio y comunicación con la base de datos.
- **Base de datos SQL (MariaDB/MySQL):** Para almacenar datos de usuarios, materias, temas, asesorías y mensajes.

## Instalación

### Requisitos Previos

- **Node.js** (versión recomendada 14 o superior)

```bash
node -v
```

- **npm** (gestor de paquetes de Node.js)

```bash
npm -v
```

## Motor de base de datos: MariaDB

Se utiliza el motor de base de datos MariaDB, instalando desde su sitio oficial - https://mariadb.com/downloads/ - la version mas reciente.
Una vez que MariaDB este instalado, se ejecutara pegara en la terminal de MariaDB el scrip de la base de datos llamado base.sql que se encuentra dentro de la carpeta: src/base/base.sql
Es necesario modificar el archivo .env, para modificar el password de acuerdo a la del usuario en local, se utilizo como el usuario "root" por defecto.

### Clonar el Repositorio

```bash
git clone https://github.com/GilbertoSolorzano/Asesorias.git
cd asesorias
```

### Instalar Dependencias

```bash
npm install react react-dom next
npm install axios
npm install @heroicons/react lucide-react
npm install chart.js react-chartjs-2
npm install tailwindcss @tailwindcss/postcss
npm install chart.js react-chartjs-2
npm install express
npm install cors
npm install body-parser
npm install dotenv
npm install mysql2
npm install nodemailer
npm install dotenv
Npm install socket.io
Npm install socket.io-client

```

## Integrantes

#### Acosta Leon Brayan

#### Daniel Ulises Reyes Bojorquez

#### Flores Hernandez Roberto David

#### Heredia Andrey Victor Felipe

#### Solorzano Galvez Gilberto Jesus

## Documentos del Proycto

### Diseño Detallado

#### Link

### Manual de Usuarios

#### Link

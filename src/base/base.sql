-- Crear la base de datos y seleccionarla
CREATE DATABASE IF NOT EXISTS sistemaAsesoria;
USE sistemaAsesoria;

--------------------------------------------------
-- Tablas de referencia y de personas
--------------------------------------------------

-- Tabla Carrera
CREATE TABLE Carrera (
    idCarrera INT AUTO_INCREMENT PRIMARY KEY,
    nombreCarrera VARCHAR(100) NOT NULL
) ENGINE = InnoDB;

-- Tabla Alumno: la llave primaria es "matricula"
CREATE TABLE Alumno (
    matricula VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR (100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    idCarrera INT NOT NULL,
    CONSTRAINT fk_alumno_carrera
        FOREIGN KEY (idCarrera) REFERENCES Carrera(idCarrera)
) ENGINE = InnoDB;

-- Tabla Asesor: la llave primaria es "matricula" e incluye campo para fotografía
CREATE TABLE Asesor (
    matricula VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR (100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    fotografia VARCHAR(255)  -- almacena la ruta o URL de la imagen
) ENGINE = InnoDB;

-- Tabla Administrador: la llave primaria es "matricula"
CREATE TABLE Administrador (
    matricula VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR (100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
) ENGINE = InnoDB;

--------------------------------------------------
-- Tablas de Materia, Tema y relaciones intermedias
--------------------------------------------------

-- Tabla Materia: se utiliza para definir las materias
CREATE TABLE Materia (
    idMateria INT AUTO_INCREMENT PRIMARY KEY,
    nombreMateria VARCHAR(100) NOT NULL
) ENGINE = InnoDB;

-- Tabla intermedia AsesorMateria: relación N:M entre Asesor y Materia
CREATE TABLE AsesorMateria (
    matriculaAsesor VARCHAR(50) NOT NULL,
    idMateria INT NOT NULL,
    PRIMARY KEY (matriculaAsesor, idMateria),
    CONSTRAINT fk_asesormateria_asesor
        FOREIGN KEY (matriculaAsesor) REFERENCES Asesor(matricula),
    CONSTRAINT fk_asesormateria_materia
        FOREIGN KEY (idMateria) REFERENCES Materia(idMateria)
) ENGINE = InnoDB;

-- Tabla Tema: cada materia puede tener muchos temas
CREATE TABLE Tema (
    idTema INT AUTO_INCREMENT PRIMARY KEY,
    idMateria INT NOT NULL,
    nombreTema VARCHAR(100) NOT NULL,
    descripcion TEXT,
    CONSTRAINT fk_tema_materia
        FOREIGN KEY (idMateria) REFERENCES Materia(idMateria)
) ENGINE = InnoDB;

--------------------------------------------------
-- Tablas de operaciones
--------------------------------------------------

-- Tabla Asesoria: relación entre alumno, asesor y tema de estudio.
-- Se incluyen:
--   - fecha_creacion: para registrar cuándo se crea la asesoría.
--   - fecha_acordada: para registrar la fecha acordada.
--   - estado: para indicar el estado de la asesoría (1, 2, 3 o 4) según las reglas definidas.
--   - lugar: para indicar el lugar de la asesoría.
CREATE TABLE Asesoria (
    idAsesoria INT AUTO_INCREMENT PRIMARY KEY,
    matriculaAlumno VARCHAR(50) NOT NULL,
    matriculaAsesor VARCHAR(50) DEFAULT NULL,
    idTema INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_acordada DATETIME DEFAULT NULL,
    estado TINYINT NOT NULL DEFAULT 1,
    lugar VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_asesoria_alumno
        FOREIGN KEY (matriculaAlumno) REFERENCES Alumno(matricula),
    CONSTRAINT fk_asesoria_asesor
        FOREIGN KEY (matriculaAsesor) REFERENCES Asesor(matricula),
    CONSTRAINT fk_asesoria_tema
        FOREIGN KEY (idTema) REFERENCES Tema(idTema)
) ENGINE = InnoDB;

-- Tabla Mensaje: mensajes enviados dentro de una asesoría.
CREATE TABLE Mensaje (
    idMensaje INT AUTO_INCREMENT PRIMARY KEY,
    idAsesoria INT NOT NULL,
    matriculaRemitente VARCHAR(50) NOT NULL,  -- almacena la matrícula del remitente (alumno o asesor)
    mensaje TEXT NOT NULL,
    horaMensaje DATETIME NOT NULL,
    CONSTRAINT fk_mensaje_asesoria
        FOREIGN KEY (idAsesoria) REFERENCES Asesoria(idAsesoria)
) ENGINE = InnoDB;

--------------------------------------------------
-- Tablas para encuestas
--------------------------------------------------

-- Tabla Encuesta:
-- Cada asesoría tendrá dos encuestas, una para 'alumno' y otra para 'asesor'.
-- Se utiliza una restricción UNIQUE para asegurar que en cada asesoría exista
-- solo una encuesta por tipo.
CREATE TABLE Encuesta (
    idEncuesta INT AUTO_INCREMENT PRIMARY KEY,
    idAsesoria INT NOT NULL,
    tipoEncuesta ENUM('alumno', 'asesor') NOT NULL,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_encuesta_asesoria
        FOREIGN KEY (idAsesoria) REFERENCES Asesoria(idAsesoria),
    CONSTRAINT unq_encuesta UNIQUE (idAsesoria, tipoEncuesta)
) ENGINE = InnoDB;

-- Tabla PreguntaEncuesta:
-- Se registra la lista maestra de preguntas para cada tipo de encuesta ('alumno' o 'asesor').
CREATE TABLE PreguntaEncuesta (
    idPregunta INT AUTO_INCREMENT PRIMARY KEY,
    tipoEncuesta ENUM('alumno', 'asesor') NOT NULL,
    enunciado TEXT NOT NULL,
    orden INT  -- para definir el orden de las preguntas
) ENGINE = InnoDB;

-- Tabla RespuestaEncuesta:
-- Conecta una encuesta con la respuesta numérica (1-10) dada a una pregunta.
CREATE TABLE RespuestaEncuesta (
    idRespuesta INT AUTO_INCREMENT PRIMARY KEY,
    idEncuesta INT NOT NULL,
    idPregunta INT NOT NULL,
    matriculaRespondente VARCHAR(50) NOT NULL,  -- será la matrícula del alumno o del asesor, según corresponda
    respuesta TINYINT NOT NULL,
    fechaRespuesta DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_respuesta_encuesta
        FOREIGN KEY (idEncuesta) REFERENCES Encuesta(idEncuesta),
    CONSTRAINT fk_respuesta_pregunta
        FOREIGN KEY (idPregunta) REFERENCES PreguntaEncuesta(idPregunta),
    CONSTRAINT chk_respuesta_rango CHECK (respuesta BETWEEN 1 AND 10)
) ENGINE = InnoDB;

--------------------------------------------------
-- Tabla MaterialApoyo
--------------------------------------------------

-- La tabla MaterialApoyo contendrá el material de apoyo asociado a una materia.
-- Se registrará un título, el contenido (ruta a PDF o URL de un video de YouTube),
-- una descripción y la materia a la que pertenece.
CREATE TABLE MaterialApoyo (
    idMaterial INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido VARCHAR(500) NOT NULL,  -- puede ser ruta a un PDF o URL de un video
    descripcion TEXT,
    idMateria INT NOT NULL,
    CONSTRAINT fk_materialapoyo_materia
    FOREIGN KEY (idMateria) REFERENCES Materia(idMateria)
) ENGINE = InnoDB;

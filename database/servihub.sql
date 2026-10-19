-- =====================================================================
-- ServiHub - Tarea 2: Script de creación de las 4 tablas del CRUD
-- Tablas: roles, usuarios, categorias, servicios
-- Motor: PostgreSQL
-- Uso:   createdb servihub
--        psql -d servihub -f servihub_tarea2.sql
-- =====================================================================

DROP TABLE IF EXISTS servicios   CASCADE;
DROP TABLE IF EXISTS categorias  CASCADE;
DROP TABLE IF EXISTS usuarios    CASCADE;
DROP TABLE IF EXISTS roles       CASCADE;

CREATE TABLE roles (
    id_rol       SERIAL       PRIMARY KEY,
    nombre       VARCHAR(30)  NOT NULL UNIQUE,
    descripcion  VARCHAR(200)
);

CREATE TABLE usuarios (
    id_usuario  SERIAL        PRIMARY KEY,
    id_rol      INTEGER       NOT NULL,
    nombre      VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    telefono    VARCHAR(20),
    activo      BOOLEAN       NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_usuarios_rol
        FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_usuarios_email
        CHECK (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

CREATE TABLE categorias (
    id_categoria  SERIAL       PRIMARY KEY,
    nombre        VARCHAR(80)  NOT NULL UNIQUE,
    descripcion   VARCHAR(200)
);

CREATE TABLE servicios (
    id_servicio   SERIAL         PRIMARY KEY,
    id_categoria  INTEGER        NOT NULL,
    nombre        VARCHAR(100)   NOT NULL,
    descripcion   VARCHAR(300),
    precio_base   NUMERIC(12,2)  NOT NULL DEFAULT 0,
    CONSTRAINT fk_servicios_categoria
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_servicios_categoria_nombre
        UNIQUE (id_categoria, nombre),
    CONSTRAINT ck_servicios_precio_base
        CHECK (precio_base >= 0)
);

CREATE INDEX idx_usuarios_rol       ON usuarios (id_rol);
CREATE INDEX idx_servicios_categoria ON servicios (id_categoria);

-- ---------------------------------------------------------------------
-- Datos de prueba (contraseña de todos los usuarios: Servihub2026,
-- almacenada cifrada con bcrypt)
-- ---------------------------------------------------------------------
INSERT INTO roles (nombre, descripcion) VALUES
    ('cliente',       'Busca servicios, consulta trabajadores, solicita y califica'),
    ('trabajador',    'Publica sus servicios, administra disponibilidad y acepta/rechaza solicitudes'),
    ('administrador', 'Gestiona usuarios, categorías, reportes y supervisa la plataforma');

INSERT INTO usuarios (id_rol, nombre, email, password, telefono, activo) VALUES
    (3, 'Administrador ServiHub', 'admin@servihub.com',  '$2a$10$Nvs92sgqOdeccyfXDpq7mOWhh3FU8rYJMlq1rqppyZ7J8/jPo5uEO', '3000000000', TRUE),
    (2, 'Carlos Mejía',           'carlos@servihub.com', '$2a$10$Nvs92sgqOdeccyfXDpq7mOWhh3FU8rYJMlq1rqppyZ7J8/jPo5uEO', '3101112233', TRUE),
    (2, 'Laura Gómez',            'laura@servihub.com',  '$2a$10$Nvs92sgqOdeccyfXDpq7mOWhh3FU8rYJMlq1rqppyZ7J8/jPo5uEO', '3102223344', TRUE),
    (1, 'Camila Torres',          'camila@servihub.com', '$2a$10$Nvs92sgqOdeccyfXDpq7mOWhh3FU8rYJMlq1rqppyZ7J8/jPo5uEO', '3203334455', TRUE);

INSERT INTO categorias (nombre, descripcion) VALUES
    ('Reparaciones del hogar',     'Electricistas, plomeros y técnicos'),
    ('Belleza y cuidado personal', 'Barberos, peluqueros y estilistas'),
    ('Salud y bienestar',          'Fisioterapeutas y masajistas');

INSERT INTO servicios (id_categoria, nombre, descripcion, precio_base) VALUES
    (1, 'Instalación de luces',   'Lámparas y puntos de luz',     40000),
    (1, 'Revisión de tableros',   'Revisión de tableros eléctricos', 50000),
    (1, 'Reparación de fugas',    'Detección y reparación de fugas', 50000),
    (2, 'Corte de cabello',       'Corte clásico o moderno',      15000),
    (3, 'Sesión de fisioterapia', 'Sesión de rehabilitación física', 60000);

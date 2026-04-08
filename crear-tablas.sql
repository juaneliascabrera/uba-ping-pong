-- Seteo el rol con el que voy a crear el esquema y las tablas
set role to ping_pong_owner;
-- hay que ejecutar lo que sigue luego de conectarse a la base de datos ping_pong_owner
-- dentro de sql: \c ping_pong_db
-- "Carpeta" que va a contener varias" 
create schema ping_pong_sport;
grant usage on schema ping_pong_sport to ping_pong_admin;

-- Tabla de Productos
create table terox.productos (
    producto_id serial primary key,
    nombre varchar(100) not null,
    precio int not null check (precio >= 0),
    stock int not null check (stock >= 0),
    descripcion text,
    imagen_url varchar(255)
--    usuario_id REFERENCES terox.usuarios(id) -- FK a usuarios, para relacionar un producto/post con su publicador
);

CREATE TABLE terox.usuarios (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

grant select, insert, update, delete on terox.usuarios to terox_admin;
grant select, insert, update, delete on terox.usuarios_id_seq to terox_admin;

grant select, insert, update, delete on terox.productos to terox_admin;
grant select, insert, update, delete on terox.productos_producto_id_seq to terox_admin;

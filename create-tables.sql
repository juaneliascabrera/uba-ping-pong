-- Seteo el rol con el que voy a crear el esquema y las tablas
set role to ping_pong_owner;
-- hay que ejecutar lo que sigue luego de conectarse a la base de datos ping_pong_owner
-- dentro de sql: \c ping_pong_db
-- "Carpeta" que va a contener varias" 
create schema ping_pong_sport;
grant usage on schema ping_pong_sport to ping_pong_admin;

-- Tabla de Productos
create table ping_pong_sport.matches (
    match_id serial primary key,
    player_1 varchar(100) not null,
    player_2 varchar(100) not null,
    played_at timestamptz default current_timestamp
--    comentarios text,
--    usuario_id REFERENCES terox.usuarios(id) -- FK a usuarios, para relacionar un producto/post con su publicador
);

-- 2. Creamos el "hijo" que depende del padre
CREATE TABLE ping_pong_sport.sets (
    set_id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(match_id) ON DELETE CASCADE, -- Esta es la FK
    points_player_1 INT check (points_player_1 >= 0),
    points_player_2 INT check (points_player_2 >= 0),
    set_number INT check (set_number >= 0) -- Para saber si es el set 1, 2 o 3
);

grant select, insert, update, delete on terox.usuarios to terox_admin;
grant select, insert, update, delete on terox.usuarios_id_seq to terox_admin;

grant select, insert, update, delete on terox.productos to terox_admin;
grant select, insert, update, delete on terox.productos_producto_id_seq to terox_admin;

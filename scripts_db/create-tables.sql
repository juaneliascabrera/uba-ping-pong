-- Seteo el rol con el que voy a crear el esquema y las tablas
set role to ping_pong_owner;
-- hay que ejecutar lo que sigue luego de conectarse a la base de datos ping_pong_owner
-- dentro de sql: \c ping_pong_db
-- "Carpeta" que va a contener varias" 
create schema ping_pong_sport;
grant usage on schema ping_pong_sport to ping_pong_admin;

-- Users
CREATE TABLE ping_pong_sport.users(
    username varchar(50) primary key CHECK (username NOT LIKE '% %'),
    created_at timestamptz default current_timestamp
);

-- Matches
create table ping_pong_sport.matches (
    match_id serial primary key,
    player_1_username varchar(50) REFERENCES ping_pong_sport.users(username) not null,
    player_2_username varchar(50) REFERENCES ping_pong_sport.users(username) not null,
    winner_username varchar(50) REFERENCES ping_pong_sport.users(username) not null,
    played_at timestamptz default current_timestamp
);

-- Sets (depends of matches)
CREATE TABLE ping_pong_sport.sets (
    set_number INT check (set_number > 0),
    match_id INT REFERENCES ping_pong_sport.matches(match_id) ON DELETE CASCADE,
    PRIMARY KEY  (match_id, set_number),
    points_player_1 INT check (points_player_1 >= 0),
    points_player_2 INT check (points_player_2 >= 0)    
);

/* Alters */
/*ALTER TABLE ping_pong_sport.users DROP username
ALTER TABLE ping_pong_sport.users DROP user_id
ALTER TABLE ping_pong_sport.users ADD username_pk PRIMARY KEY    username*/
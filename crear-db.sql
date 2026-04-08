create user ping_pong_owner nologin;
create user ping_pong_admin password 'cambiar_esta_clave';

create database ping_pong_db owner ping_pong_owner;
grant connect on database ping_pong_db to ping_pong_admin;

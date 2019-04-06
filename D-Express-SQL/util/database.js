const mysql = require('mysql2');
const Sequelize = require('sequelize');

/*
If using SQL directly:

const pool = mysql.createPool({
    host: 'localhost',
    user: 'nodecomplete',
    database: 'nodecomplete',
    password: 'password'
});

module.exports = pool.promise();
*/

/*
    mysqld

    mysqladmin -uroot shutdown

    mysql -uroot

    CREATE DATABASE nodecomplete;

    CREATE TABLE products (
        id smallint unsigned not null auto_increment,
        title VARCHAR(254) not null,
        price DOUBLE not null,
        description TEXT not null,
        imageUrl VARCHAR(254) not null,
        constraint pk_example primary key (id));

    CREATE USER 'nodecomplete'@'localhost' IDENTIFIED BY 'password';
    GRANT ALL ON nodecomplete.* TO 'nodecomplete'@'localhost';
    ALTER USER 'nodecomplete'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
    FLUSH PRIVILEGES;

 */

const sequelize = new Sequelize('nodecomplete', 'nodecomplete', 'password', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

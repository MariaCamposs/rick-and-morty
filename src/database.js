import utils from './utils/utils.js';
import { Sequelize } from "sequelize";
import fetch from 'node-fetch';
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
},
);
await sequelize.authenticate(console.log("sequelize on"))
  .catch(error => console.log(error));

const database = {
  episodes: {
    createTable: async () => {
      await sequelize.query(`
      CREATE TABLE IF NOT EXISTS episodes (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      episode VARCHAR(6) NOT NULL,
      characters VARCHAR(255) NOT NULL);`)
    },
    getData: async () => {
      const count = await utils.count('episode');
      const endpoint = 'https://rickandmortyapi.com/api/episode/';
      for (let i = 1; i <= count; i++) {
        try {
          const request = await fetch(endpoint + i);
          const json = await request.json();
          const characters = json.characters.map(character => character.split('/').pop()).join(',');
          await sequelize.query(`
          INSERT INTO episodes VALUES (${json.id}, "${json.name}", '${json.episode}', '${characters}');`);
        } catch (error) {
          console.log(error);
        };
      };
    },
  },
  locations: {
    createTable: async () => {
      await sequelize.query(`
      CREATE TABLE IF NOT EXISTS locations (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(60) NOT NULL,
      type VARCHAR(70),
      dimension VARCHAR(70));`)
    },
    getData: async () => {
      const count = await utils.count('location');
      const endpoint = 'https://rickandmortyapi.com/api/location/';
      for (let i = 1; i <= count; i++) {
        try {
          const request = await fetch(endpoint + i);
          const json = await request.json();
          await sequelize.query(`
          INSERT INTO locations VALUES
          (${json.id}, "${json.name}", "${json.type}", "${json.dimension}");`);
        } catch (error) {
          console.log(error);
        };
      };
    },
  },
  characters: {
    createTable: async () => {
      await sequelize.query(`
      CREATE TABLE IF NOT EXISTS characters (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(60) NOT NULL,
      status VARCHAR(10),
      species VARCHAR(50),
      type VARCHAR(40),
      gender VARCHAR(40),
      origin VARCHAR(40),
      location VARCHAR(40),
      image VARCHAR(250));`)
    },
    getData: async () => {
      const count = await utils.count('character');
      const endpoint = 'https://rickandmortyapi.com/api/character/';
      for (let i = 1; i <= count; i++) {
        try {
          const request = await fetch(endpoint + i);
          const json = await request.json();
          await sequelize.query(`
          INSERT INTO characters VALUES (
            ${json.id}, "${json.name}", "${json.status}", "${json.species}", "${json.type}",
            "${json.gender}", "${json.origin.name}", "${json.location.name}", "${json.image}");`);
        } catch (error) {
          console.log(error);
        };
      };
    },
  },
};

//await database.episodes.createTable()
//  .then(database.episodes.getData())
//  .then(database.locations.createTable())
//  .then(database.locations.getData())
//  .then(database.characters.createTable())
//  .then(database.characters.getData());

export default sequelize;

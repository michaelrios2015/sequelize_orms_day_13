const { Client } = require('pg');
const client = new Client (process.env.DATABASE_URL || 'postgress://postgres:JerryPine@localhost/fordham_users');


const syncAndSeed = async()=> {
    const SQL = `
    DROP TABLE IF EXISTS users
    CREATE TABLE users(
        id SERIAL PRIMARY KEY
    );
    `;
    await client.query(SQL);

}


const init = async()=> {
    try {
        await client.connect();
    }
    catch(ex){
        console.log(ex)
    }
};

init();

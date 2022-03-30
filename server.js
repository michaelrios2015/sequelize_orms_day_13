// so now we are doing the same thing in sequelize
// bringing in the entire module/library
// Sequelize needs pg just in case you were wondering 
const Sequelize = require('sequelize');

// faker is hving problems but casual is working a ok :)
const casual = require('casual');

// getting our string
const { STRING } = Sequelize;
// db most be a class, giving it our database adress (??) as well 
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:JerryPine@localhost/fordham_users');

// this is how sequelize defines a table I assume I than use User.. should find out soon
const User = db.define('User', {
    email: {
        type: STRING,
        allowNull: false,
        // Bamo like that sequelize gives you some useful functions
        validate: {
            isEmail: true
        }
    },
    bio: {
        type: STRING
    }
});

//  so this is the famous hook and seems like it should be very useful in validating data and such
User.beforeSave( user => {
    // why does this not need user.dataValues.bio... not a clue..
    // check to see if it has a bio if not add one it is cool
    if(!user.bio){
        user.bio = `${user.email} BIO is ${casual.text}`
    };
    // console.log(user.bio);
});

// now with sequelize
const syncAndSeed = async()=> {
    // I think this drops everything 
    await db.sync({force: true});
    // so a little less writing
    await User.create({ email: 'moe@gmail.com', bio: "I am a bio"});
    await User.create({ email: 'lucy@yahoo.com'});
    await User.create({ email: 'curly@aol.com'});
};

const init = async()=> {
    // try catch is always good here as things can go wrong
    try {
        // this most be a sequelize thing, should probably look it up
        await db.authenticate();
        // has not changed
        await syncAndSeed();
        // it gives you a bit more information
        // console.log(await User.findAll());
    }
    catch(ex){
        console.log(ex)
    }    

}

init();

// you can use npm unistall package name ?? WOW!!

/*
const { Client } = require('pg');
const client = new Client (process.env.DATABASE_URL || 'postgress://postgres:JerryPine@localhost/fordham_users');

// we creat the database
// apperently the SERIAL makes a special sequence thing in Postgres should look into it
const syncAndSeed = async()=> {
    const SQL = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(50) NOT NULL UNIQUE
    );
    `;
    await client.query(SQL);

}
// we get the users
const getUsers = async() => {
    return (await client.query('SELECT * FROM users;')).rows;
};

// SO again that is the safer way of adding data and I really should take a look at it at one point
// not sure what the RETURNING does need to check on that too
const createUser = async({email}) => {
    return (await client.query('INSERT INTO users (email) VALUES($1) RETURNING *', [email])).rows[0]
}

const init = async()=> {
    try {
        await client.connect();
        await syncAndSeed();
        // not entirely sure why we put it in a variable I mean we are just seeding the database
        const user = await createUser( {email: 'moe@gmail.com'});
        console.log(await getUsers());
    }
    catch(ex){
        console.log(ex)
    }
};

init();
*/
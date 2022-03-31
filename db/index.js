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
        user.bio = `${user.email} BIO is ${casual.sentence}`
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

// you can use npm unistall package name ?? WOW!!

// not entirely sure if I understand how module.exports work
// I can use it but should probably look into it a bit more
module.exports = {
    db,
    syncAndSeed,
    // this is strictly a way for us to think about it I believe
    models: {
        User
    }
}
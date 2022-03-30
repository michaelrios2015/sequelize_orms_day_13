// so now instead of importing soimeone elses code we are importing our code 
const {db, syncAndSeed, models: { User} } = require('./db');
const express = require('express');

const app = express();

// so this is like an api
app.get('/users', async(req, res, next)=> {
    try {
        const users = await User.findAll();
        res.send(users);
    }
    catch(ex){
        next(ex);
    }
})



const init = async()=> {
    // try catch is always good here as things can go wrong
    try {
        // this most be a sequelize thing, should probably look it up
        await db.authenticate();
        // has not changed
        await syncAndSeed();
        // it gives you a bit more information
        // console.log(await User.findAll());
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
        console.log(ex)
    }    

}

init();


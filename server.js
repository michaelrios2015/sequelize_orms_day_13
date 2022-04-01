// so now instead of importing soimeone elses code we are importing our code 
const {db, syncAndSeed } = require('./db');
const express = require('express');
const path = require('path');

const app = express();

// this is some magic that lets us send the information with the post 
app.use(express.urlencoded({ extended: false }));

// this is magic I use that lets me turn a POST into a DELETE
app.use(require('method-override')('_method'));

// so this is a little different from past ones because there we were conecting to a folder 
// and here we are just getting a folder I think is the difference
app.get('/styles.css', (req, res)=> res.sendFile(path.join(__dirname, 'styles.css')));

// not sure why we used this..
app.get('/', (req, res)=> res.redirect('/users'));

app.use('/users', require('./routes/users'));



const init = async()=> {
    // try catch is always good here as things can go wrong
    try {
        // this most be a sequelize thing, should probably look it up
        await db.authenticate();
        // has not changed
        // so it does not sync each time we use SET variable=value & run script
        if (process.env.SYNC){
            await syncAndSeed();
        }
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


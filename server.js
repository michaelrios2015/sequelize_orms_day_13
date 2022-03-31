// so now instead of importing soimeone elses code we are importing our code 
const {db, syncAndSeed, models: { User} } = require('./db');
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


// so again the code itself is pretty easy but how do we connect it to the front end
app.delete('/users/:id', async(req, res, next)=> {
    // console.log(req.body);
    try {
        const user = await User.findByPk(req.params.id);
        await user.destroy();
        res.redirect('/users');
    }
    catch(ex){
        next(ex);
    }
})


// this is pretty amazing... the form use a get but we just tell it to use an override.. 
// the post the code is pretty damn easy, you just need the magic thing uptop to make sure the req.body comes through ... i thnk 
app.post('/users', async(req, res, next)=> {
    console.log(req.body);
    try {
        const user = await User.create(req.body);
        res.redirect(`/users/${ user.id }`)
    }
    catch(ex){
        next(ex);
    }
})


// not sure why we we are using this instead of just putting the code in this route.. will probably become
// clear latter 
app.get('/', (req, res) => res.redirect('/users'));

// so this is like an api
// need to learn more about the html form tag but name essentially seems to be how you access the input
app.get('/users', async(req, res, next)=> {
    try {
        const users = await User.findAll();
        res.send(`
        <html>
            <head>
                <link rel = 'stylesheet' href = '/styles.css' />
            </head>
            <body>
                <h1>Users ${ users.length }</h1>
                <form method='POST' id='user-form'>
                    <input name = 'email' placeHolder = 'enter email' />
                    <textarea name ='bio'></textarea>
                    <button>Create</button>
                </form>
                <ul>
                    ${ users.map ( user => `
                    <li>
                        <a href='/users/${ user.id }'>
                        ${ user.email }
                        </a>
                    </li>
                    `).join('')}
                </ul>
            </body>
        </html>
        `);
    }
    catch(ex){
        next(ex);
    }
})


// so this is pretty standard
// but now we have the magic formula in form that lets us go from GET to POST to DELETE
app.get('/users/:id', async(req, res, next)=> {
    try {
        // we just put it in a array so we can still loop over it 
        const user = await User.findByPk(req.params.id);
        res.send(`
        <html>
            <head>
                <link rel = 'stylesheet' href = '/styles.css' />
            </head>
            <body>
                <h1>Users ${ user.id }</h1>
                <ul>
                    <li>
                        <a href='/users/${ user.id }'>
                        ${ user.email }
                        </a>
                        <p>
                            ${ user.bio }
                        </p>
                        <form method='POST' action='/users/${user.id}?_method=DELETE'>
                        <button>x</button>
                    </li>
                </ul>
            </body>
        </html>
        `);
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


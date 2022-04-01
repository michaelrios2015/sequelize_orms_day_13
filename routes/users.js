// so now instead of importing soimeone elses code we are importing our code 
const { models: { User} } = require('../db');
// the magic routers that lets use put this in a folder
const app = require('express').Router();

// this is pretty magical it just lets us take the code out and bring it back in 
module.exports = app;

// so again the code itself is pretty easy but how do we connect it to the front end
app.delete('/:id', async(req, res, next)=> {
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
app.post('/', async(req, res, next)=> {
    console.log(req.body);
    try {
        const user = await User.create(req.body);
        res.redirect(`/users/${ user.id }`)
    }
    catch(ex){
        next(ex);
    }
})



// so this is like an api
// need to learn more about the html form tag but name essentially seems to be how you access the input
app.get('/', async(req, res, next)=> {
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
app.get('/:id', async(req, res, next)=> {
    try {
        // we just put it in a array so we can still loop over it 
        const user = await User.findByPk(req.params.id);
        res.send(`
        <html>
            <head>
                <link rel = 'stylesheet' href = '/styles.css' />
            </head>
            <body>
                <h1><a href='/'>Users</a> ${ user.id }</h1>
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






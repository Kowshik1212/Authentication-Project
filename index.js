const express = require('express');
const boolean = require('joi/lib/types/boolean');
const app = express();
app.use(express.json());

const allUsersData = [];
app.post('/register', (req, res) => {
    ['username', 'password', 'name', 'college', 'year-of-graduation'].forEach(key => {
        if (req.body[key] === '' || req.body[key] === undefined)
            return res.status(400).send(`${key} is required`);
    })
    allUsersData.forEach(user => {
        if (user.username === req.body.username)
            return res.status(400).send(`${req.body.username} already exists`);
    })
    allUsersData.push(req.body);
    res.send("Sucessfully Registered");
})

app.put('/profile', (req, res) => {
    let flag = false;
    allUsersData.forEach(user => {
        if (user.username === req.body.username && user.password === req.body.password) {
            flag = true;
            ['name', 'college', 'year-of-graduation'].forEach(key => {
                if (req.body[key] != undefined)
                    user.key = req.body[key];
            })
            res.send("Successfully updated your profile");
            return res.send(user);
        }
        if (user.username === req.body.username && user.password !== req.body.password)
            return res.status(401).send("Password is not correct");
    })
    if (!flag)
        return res.status(401).send("Username is not correct");
})

app.listen(7050, () => { console.log("Listening to the port 7050") });
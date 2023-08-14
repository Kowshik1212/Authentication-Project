const express = require('express');
const boolean = require('joi/lib/types/boolean');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const secret_key = "JWT_SECRET_KEY";
const verifyToken = (req, res, next) => {
    const token = req.headers['authtoken'];
    if (token === null || token === undefined) {
        return res.status(400).send("token is required to call this API!!!");
    }
    jwt.verify(token, secret_key, (err, decodedInfo) => {
        if (err)
            return res.status(404).send("You are not allowed to perform the operation");
        req.userInfo = decodedInfo;
        next();
    })
}

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

app.post('/login', (req, res) => {
    ['username', 'password'].forEach(key => {
        if (req.body[key] === undefined || req.body[key] === null)
            return res.status(400).send(`${key} is required`);
    })
    let flag = false;
    allUsersData.forEach(user => {
        if (user['username'] === req.body['username'] && user['password'] === req.body['password']) {
            flag = true;
            const token = jwt.sign({ username: user.username }, secret_key, { expiresIn: 36000 });
            res.setHeader("authtoken", token);
            setTimeout(() => res.json({ message: "Successfully LoggedIn" }), 0);
        }
    })
    if (!flag) {
        return res.status(404).send("Wrong credentials");
    }
})

app.put('/profile', verifyToken, (req, res) => {
    let flag = false;
    allUsersData.forEach(user => {
        if (user.username === req.userInfo.username) {
            flag = true;
            ['password', 'name', 'college', 'year-of-graduation'].forEach(key => {
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

app.get("/profiles", (req, res) => {
    const usersDataCopy = JSON.parse(JSON.stringify(allUsersData));

    usersDataCopy.forEach(user => {
        delete usersDataCopy['password'];
    })


    res.json(usersDataCopy);
})

app.listen(7050, () => { console.log("Listening to the port 7050") });
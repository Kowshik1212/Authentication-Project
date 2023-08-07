const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
const courses = [
    {
        id: '1',
        name: 'course1'
    },
    {
        id: '2',
        name: 'course2'
    },
    {
        id: '3',
        name: 'course3'
    }
]
app.get('/:year/:month', (req, res) => {
    res.send(req.query);
})

app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3]);
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => {
        if (c.id === req.params.id) {
            return c;
        }
    });
    if (!course)
        return res.status(404).send("the id you are trying to access is not there in the array");
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    //checking whether given id is present or not
    const course = courses.find(c => c.id === req.params.id);
    if (!course)
        return res.status(404).send("send a valid id");

    //validating the input
    const schema = {
        name: Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    //updating the courses
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
    //validating the course id
    const course = courses.find(c => c.id === req.params.id)
    if (!course) return res.status(400).send("Please send a valid id");
    //deleting the course
    courses.splice(req.params.id, 1);
    res.send(course);
})

const port = process.env.PORT || 7050
app.listen(port, () => { console.log(`Listening to port ${port}...`) })
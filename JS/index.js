const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Load data
const usersPath = path.join(__dirname, 'data', 'users.json');
const mealsPath = path.join(__dirname, 'data', 'meals.json');
const mealPlansPath = path.join(__dirname, 'data', 'meal-plans.json');

const loadData = (filePath) => JSON.parse(fs.readFileSync(filePath));

let users = loadData(usersPath);
let meals = loadData(mealsPath);
let mealPlans = loadData(mealPlansPath);

// Custom middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET routes for data
app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/meals', (req, res) => {
    res.json(meals);
});

app.get('/meal-plans', (req, res) => {
    res.json(mealPlans);
});

// POST routes for data
app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length + 1;
    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
});

app.post('/meals', (req, res) => {
    const newMeal = req.body;
    newMeal.id = meals.length + 1;
    meals.push(newMeal);
    fs.writeFileSync(mealsPath, JSON.stringify(meals, null, 2));
    res.status(201).json(newMeal);
});

// PATCH route for data
app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedData = req.body;
    const user = users.find(u => u.id === userId);
    if (user) {
        Object.assign(user, updatedData);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// DELETE route for data
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        res.status(204).send();
    } else {
        res.status(404).send('User not found');
    }
});

// Query parameters for filtering data
app.get('/meals/filter', (req, res) => {
    const { calorieLimit } = req.query;
    if (calorieLimit) {
        const filteredMeals = meals.filter(meal => meal.calories <= parseInt(calorieLimit));
        res.json(filteredMeals);
    } else {
        res.json(meals);
    }
});

// Route parameters for specific resources
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// View template rendering
app.set('view engine', 'ejs');

app.get('/view-users', (req, res) => {
    res.render('users', { users });
});

app.get('/add-user', (req, res) => {
    res.render('add-user');
});

app.post('/add-user', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length + 1;
    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    res.redirect('/view-users');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

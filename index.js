const express = require('express'); // Import the express framework
const bodyParser = require('body-parser'); // Middleware to parse JSON bodies
const fs = require('fs'); // Use this to work with your file system
const path = require('path'); // Import path module, lets me transform file paths consistently

const app = express(); // Initialize Express
const port = 3000; // Set the Port to 3000

app.use(bodyParser.json()); // this helps the server understand data coming to it

// Serve static files from 'Pages' and 'CSS' directories
app.use(express.static(path.join(__dirname, 'Pages')));
app.use('/css', express.static(path.join(__dirname, 'CSS')));


// Load data from JSON files
const usersPath = path.join(__dirname, 'data', 'users.json');
const mealsPath = path.join(__dirname, 'data', 'meals.json');
const mealPlansPath = path.join(__dirname, 'data', 'meal-plans.json');

// define a function load data. This will read my JSON data and parse the data 
const loadData = (filePath) => JSON.parse(fs.readFileSync(filePath));

// I am assigning variables for users, meals and mealplans and using loadData to get the data from my JSON files 
let users = loadData(usersPath);
let meals = loadData(mealsPath);
let mealPlans = loadData(mealPlansPath);

// Middleware for logging my requests
// logs the HTTP method and the URL of the request
app.use((req, res, next) => { 
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware for my error handling
// Remember 4 inputs needed 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oh no! my bread didnt not rise, and neither did my website. Try again later');
});

// Route for my homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'index.html'));
});

// API endpoints for my USERS 
// format for consistency: GET, POST, PUT, PATCH, DELETE
app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length + 1;
    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
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

// API endpoints for MEALS 
// format for consistency: GET, POST, PUT, PATCH, DELETE
app.get('/meals', (req, res) => {
    res.json(meals);
});

app.post('/meals', (req, res) => {
    const newMeal = req.body;
    newMeal.id = meals.length + 1;
    meals.push(newMeal);
    fs.writeFileSync(mealsPath, JSON.stringify(meals, null, 2));
    res.status(201).json(newMeal);
});

app.put('/meals/:id', (req, res) => {
    const mealId = parseInt(req.params.id);
    const updatedData = req.body;
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        Object.assign(meal, updatedData);
        fs.writeFileSync(mealsPath, JSON.stringify(meals, null, 2));
        res.json(meal);
    } else {
        res.status(404).send('Meal not found');
    }
});

app.patch('/meals/:id', (req, res) => {
    const mealId = parseInt(req.params.id);
    const updatedData = req.body;
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        Object.assign(meal, updatedData);
        fs.writeFileSync(mealsPath, JSON.stringify(meals, null, 2));
        res.json(meal);
    } else {
        res.status(404).send('Meal not found');
    }
});

app.delete('/meals/:id', (req, res) => {
    const mealId = parseInt(req.params.id);
    const mealIndex = meals.findIndex(m => m.id === mealId);
    if(mealIndex !== -1) {
        meals.splice(mealIndex, 1);
        fs.writeFileSync(mealsPath, JSON.stringify(meals, null, 2));
        res.status(204).send();
    } else {
        res.status(404).send('Meal not found');
    }
});

// API endpoints for MEAL PLANS 
// format for consistency: GET, POST, PUT, PATCH, DELETE
app.get('/meal-plans', (req, res) => {
    res.json(mealPlans);
});

app.post('/meal-plans', (req, res) => {
    const newMealPlan = req.body;
    newMealPlan.id = mealPlans.length + 1;
    mealPlans.push(newMealPlan);
    fs.writeFileSync(mealPlansPath, JSON.stringify(mealPlans, null, 2));
    res.status(201).json(newMealPlan);
});

app.put('/meal-plans/:id', (req, res) => {
    const mealPlanId = parseInt(req.params.id);
    const updatedData = req.body;
    const mealPlan = mealPlans.find(mp => mp.id === mealPlanId);
    if (mealPlan) {
        Object.assign(mealPlan, updatedData);
        fs.writeFileSync(mealPlansPath, JSON.stringify(mealPlans, null, 2));
        res.json(mealPlan);
    } else {
        res.status(404).send('Meal plan not found');
    }
});

app.patch('/meal-plans/:id', (req, res) => {
    const mealPlanId = parseInt(req.params.id);
    const updatedData = req.body;
    const mealPlan = mealPlans.find(mp => mp.id === mealPlanId);
    if (mealPlan) {
        Object.assign(mealPlan, updatedData);
        fs.writeFileSync(mealPlansPath, JSON.stringify(mealPlans, null, 2));
        res.json(mealPlan);
    } else {
        res.status(404).send('Meal plan not found');
    }
});

app.delete('/meal-plans/:id', (req, res) => {
    const mealPlanId = parseInt(req.params.id);
    const mealPlanIndex = mealPlans.findIndex(mp => mp.id === mealPlanId);
    if (mealPlanIndex !== -1) {
        mealPlans.splice(mealPlanIndex, 1);
        fs.writeFileSync(mealPlansPath, JSON.stringify(mealPlans, null, 2));
        res.status(204).send();
    } else {
        res.status(404).send('Meal plan not found');
    }
});

// Query parameters for filtering meals
app.get('/meals/filter', (req, res) => {
    const { calorieLimit } = req.query;
    if (calorieLimit) {
        const filteredMeals = meals.filter(meal => meal.calories <= parseInt(calorieLimit));
        res.json(filteredMeals);
    } else {
        res.json(meals);
    }
});

// Route parameters for specific user
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// setting the view engine using embedded javascript (ejs)
app.set('view engine', 'ejs');

// View all users
app.get('/view-users', (req, res) => {
    res.render('users', { users });
});

// Add a new user
app.get('/add-user', (req, res) => {
    res.render('add-user');
});

// View all meals
app.get('/view-meals', (req, res) => {
    res.render('meals', { meals });
});

// Render the add-user.ejs view
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

// Listen for HTTTP requests on port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
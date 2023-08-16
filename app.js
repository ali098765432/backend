const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser'); 

const app = express();
const hbs = require("hbs");

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

const static_path = path.join(__dirname, './public');
const views_path = path.join(__dirname, './templates/views');
const partials_path = path.join(__dirname, './templates/partials');


const routes = require('./routes'); 
app.use('/', routes); 

const webRoutes = require('./routes/webRoutes');

app.use('/', webRoutes);

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", views_path);
// Register partials
hbs.registerPartials(partials_path);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
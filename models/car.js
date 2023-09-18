const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  yearofregistration: String,
  kmdriving: String,
  title: String,
  description: String,
  
});

const CarModel = mongoose.model('Car', carSchema);

module.exports = CarModel;

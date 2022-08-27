const express = require('express');

const configViewEngine = (app) => {
  // static để server biết chỉ được lấy data từ đâu
  app.use(express.static('./src/public'));
  app.set('view engine', 'ejs');
  // đườn link lấy view engine
  app.set('views', './src/views');
};

module.exports = configViewEngine;

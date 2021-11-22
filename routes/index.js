var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



/* 

• Retrieve all volcanos in JSON format: 
GET api/volcanos
*/

/* 
• Retrieve the information about a specific volcano – response should provide data in JSON format 
GET api/volcano/:id
*/

/* 
• Create a new volcano – A JSON response indicating success or error should be returned 
POST api/volcano
*/

/* 
• Update the details of a volcano – A JSON response containing the new details of the volcano, or an error should be returned 
PUT api/volcano/:id
*/

/* 
• Remove a volcano by its ID – A JSON response indicating success or error should be returned. 
DELETE api/volcano/:id

*/

module.exports = router;

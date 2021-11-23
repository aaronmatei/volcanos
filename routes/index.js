var express = require('express');
var router = express.Router();
var db = require('../database/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index.ejs', { title: 'Home' });
});

// GET all volcanoes view
router.get('/volcanos', (req, res) => {
  res.render('volcanos.ejs', { title: 'Volcanos' });
});

// GET specific volcano based on id view
router.get('/volcano/:id', (req, res) => {
  res.render('volcano.ejs', { title: 'Volcano', id: req.params.id });
});

router.post('/volcanos', (req, res) => {
  res.render('volcanos.ejs', { title: 'Volcanoes' });
});

router.put('/volcano/:id', (req, res) => {
  res.render('volcano.ejs', { title: 'Volcano', id: req.params.id });
});

router.delete('/volcanos', (req, res) => {
  res.render('volcanos.ejs', { title: 'Volcanoes' });
});

/* 
• Retrieve all volcanos in JSON format: 
GET api/volcanos
*/
router.get('/api/volcanos', function (req, res, next) {
  var sql = 'select * from volcano';

  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: rows,
    });
  });
});

/* 
• Retrieve the information about a specific volcano – response should provide data in JSON format 
GET api/volcano/:id
*/
router.get('/api/volcanos/:id', function (req, res) {
  var sql = 'select * from volcano where id = ?';

  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({
        message: 'Record Not Found',
      });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

/* 
• Create a new volcano – A JSON response indicating success or error should be returned 
POST api/volcano
*/
router.post('/api/volcanos', function (req, res, next) {
  var errors = [];
  var { name, location, history, active } = req.body;
  if (!name) {
    errors.push('Must have a name');
  }
  if (!location) {
    errors.push('Must have location');
  }
  if (!history) {
    errors.push('Must have history description');
  }
  if (!active) {
    errors.push('Must specify activity');
  }

  if (errors.length) {
    res.status(400).json({
      error: errors.join(','),
    });
    return;
  }

  var data = {
    name,
    location,
    history,
    active,
  };

  var sql =
    'INSERT INTO volcano (name, location, history, active) VALUES (?,?,?,?)';
  var params = [data.name, data.location, data.history, data.active];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: data,
      id: this.lastID,
    });
  });
});

/* 
• Update the details of a volcano – A JSON response containing the new details of the volcano, or an error should be returned 
PUT api/volcano/:id
*/
router.put('/api/volcanos/:id', function (req, res, next) {
  var data = {
    name: req.body.name,
    location: req.body.location,
    history: req.body.history,
    active: req.body.active,
  };
  var id = req.params.id;

  var sql = 'select * from volcano where id = ?';

  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({
        message: 'Record to update not Found',
      });
      return;
    }
    db.run(
      `UPDATE volcano set 
         name = COALESCE(?,name), 
         location = COALESCE(?,location), 
         history = COALESCE(?,history),
         active = COALESCE(?,active)  
         WHERE id = ?`,
      [data.name, data.location, data.history, data.active, req.params.id],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({
          message: 'success',
          data: data,
          changes: this.changes,
        });
      }
    );
  });
});

/* 
• Remove a volcano by its ID – A JSON response indicating success or error should be returned. 
DELETE api/volcano/:id
*/

router.delete('/api/volcanos/:id', function (req, res, next) {
  var sql = 'select * from volcano where id = ?';

  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({
        message: 'Record to delete not Found',
      });
      return;
    }

    db.run(
      'DELETE FROM volcano WHERE id = ?',
      req.params.id,
      function (err, result) {
        if (err) {
          res.status(400).json({
            error: res.message,
          });
          return;
        }
        res.json({
          message: 'deleted',
          changes: this.changes,
        });
      }
    );
  });
});

module.exports = router;

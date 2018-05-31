'use strict';

const express = require('express');
const knex = require('../knex');

// const dotenv = require('dotenv');
// dotenv.config();

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);



// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;

  knex
    .select('id', 'title', 'content')
    .from('notes')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .orderBy('id')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex  
    .select('id', 'title', 'content')
    .from('notes')
    .where('id', id)
    .then(([results]) => {
      if (!results) {
        throw new Error('Not Found');
      } else {
        res.json(results);
      }
    })
    .catch(err => {
      err.status = 404;
      next(err);
    });
});

//   notes.find(id)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next();
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes') 
    .where('id', id)
    .update(updateObj)
    .then(results =>  {
      res.json(results);
    })
    .catch(err => {
      err.status = 404;
      next(err);
    });
});

// notes.update(id, updateObj)
//   .then(item => {
//     if (item) {
//       res.json(item);
//     } else {
//       next();
//     }
//   })
//   .catch(err => {
//     next(err);
//   });
// });

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex 
    .insert(newItem)
    .into('notes')
    .returning(['title', 'content'])
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


//   notes.create(newItem)
//     .then(item => {
//       if (item) {
//         res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where('id', id)
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});
    

// .then(results => console.log(JSON.stringify(results, null, 2)));


//   notes.delete(id)
//     .then(() => {
//       res.sendStatus(204);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

module.exports = router;

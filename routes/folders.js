
'use strict';

const express = require('express');
const knex = require('../knex');

//Create a router instance
const router = express.Router();

// Get all folders
router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//Get folder by id
router.get('/:id', (req, res, next) => {
  const id =req.params.id;
  knex
    .select('id', 'name')
    .from('folders')
    .where('id', id)
    .then(([results]) => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch (err => {
      next(err);
    });
});

// Put update a folder
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const {name} = req.body;
  const updatedFolder = {name};

  /*Validate User input*/
  if (!updatedFolder) {
    const err = new Error('Missing `name` from request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where('id', id)
    .update(updatedFolder)
    .returning(['id', 'name'])
    .then(([result]) => {
      console.log(result);
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    }); 
});

//Post a new folder

router.post('/', (req, res, next) => {
  const {name} = req.body;
  const newFolder = {name};

  /*Validate User input*/
  if (!newFolder) {
    const err = new Error('Missing `name` from request body');
    err.status = 400;
    return next(err);
  }

  knex
    .insert(newFolder)
    .into('folders')
    .returning(['id', 'name'])
    .then(results => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    });
});

//Delete a folder

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('folders')
    .where('id', id)
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
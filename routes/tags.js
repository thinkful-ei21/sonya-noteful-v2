'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

// GET all tags

router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch (err => {
      next(err);
    });
});

// GET one tag by id
router.get('/:id', (req, res, next) => {

  const id = req.params.id;

  knex
    .select('id', 'name')
    .from('tags')
    .where('id', id)
    .then(([results]) => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// POST a new tag

router.post('/', (req, res, next) => {
  const {name} = req.body;
  const newTag = {name};
  console.log(newTag);
  console.log(req.body);

  //Validate User Input
  if(!newTag) {
    const err = new Error ('Missing `name` from request body');
    err.status = 400;
    return next(err);  
  }

  knex
    .insert(newTag)
    .into('tags')
    .returning(['id', 'name'])
    .then(results => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    });
});

// PUT update a tag
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {name} = req.body;
  const updatedTag = {name};
  
  //Validate user input
  if(!updatedTag) {
    const err = new Error('Missing `name` from request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where('id', id)
    .update(updatedTag)
    .returning(['id', 'name'])
    .then(([result]) => {
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

//Delete a tag
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
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
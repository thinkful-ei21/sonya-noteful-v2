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

module.exports = router;
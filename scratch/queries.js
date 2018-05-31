'use strict';

const dotenv = require('dotenv');
dotenv.config();

const knex = require('../knex');

// //query for GET notes endpoint
// let searchTerm = 'gaga';
// knex
//   .select('id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// //query for GET notes by id
// const id = 1003;
// knex  
//   .select('id', 'title', 'content')
//   .from('notes')
//   .where('id', id)
//   .then(([results]) => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.log('NOT FOUND');
//   });


// //query to create a note
// const newNote = {content: 'Test Test Test'};
// knex 
//   .insert(newNote)
//   .into('notes')
//   .returning(['title', 'content'])
//   .then(results => console.log(JSON.stringify(results, null, 2)))
//   .catch(err => {
//     console.log('DID NOT WORK');
//   });

//query to delete a note
const id = 1001;
knex('notes')
  .where('id', id)
  .del();
  //.then(results => console.log(JSON.stringify(results, null, 2)));

knex
  .select('id')
  .from('notes')
  .then(results => console.log(JSON.stringify(results, null, 2)));
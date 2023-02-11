#! /usr/bin/env node

// console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
let async = require('async');
let Category = require('./models/category');
let Color = require('./models/color');
let Item = require('./models/item');
let ItemInstance = require('./models/itemInstance');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let categories = [];
let colors = [];
let items = [];
let itemInstances = [];

function categoryCreate(title, description, cb) {
	let categoryDetail = {title, description};
  
	let category = new Category(categoryDetail);
		
	category.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Category: ' + category);
		categories.push(category);
		cb(null, category);
	});
}

function colorCreate(title, cb) {
	let color = new Color({ title });
		
	color.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Color: ' + color);
		colors.push(color);
		cb(null, color);
	});
}

function itemCreate(title, description, price, quantity, category, cb) {
	let itemDetail = {title, description, price, quantity, category};
		
	let item = new Item(itemDetail);    
	item.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Item: ' + item);
		items.push(item);
		cb(null, item);
	});
}


function itemInstanceCreate(item, status, color, cb) {
	let itemInstanceDetail = {item, status, color};    
		
	let itemInstance = new ItemInstance(itemInstanceDetail);    
	itemInstance.save(function (err) {
		if (err) {
			console.log('ERROR CREATING itemInstance: ' + itemInstance);
			cb(err, null);
			return;
		}
		console.log('New itemInstance: ' + itemInstance);
		itemInstances.push(itemInstance);
		cb(null, itemInstance);
	});
}


function createCategories(cb) {
    async.series([
        function(callback) {
        	categoryCreate('Вязаные игрушки', 'Связанные Ириной игрушки', callback);
        },
		function(callback) {
			categoryCreate('Сшитые игрушки', 'Сшитые Ириной игрушки', callback);
		}],
        // optional callback
    cb);
}


function createColors(cb) {
    async.series([
        function(callback) {
          	colorCreate('Зелёный', callback);
        },
        function(callback) {
			colorCreate('Розовый', callback);
        },
        function(callback) {
			colorCreate('Фиолетовый', callback);
        }],
        // optional callback
    cb);
}


function createItems(cb) {
    async.series([
        function(callback) {
          	itemCreate("Ле Гушка", "Самая крутая Ле Гушка, которая идёт вперёд!", 300, 1, categories[0], callback);
        },
        function(callback) {
			itemCreate("Шуршик", "Крутой диновзарик!", 200, 2, categories[1], callback);
        },],
        // optional callback
    cb);
}


function createItemsInstances(cb) {
    async.parallel([
		function(callback) {
			itemInstanceCreate(items[0], "Available", colors[0], callback);
		},
        function(callback) {
			itemInstanceCreate(items[1], "Not available", colors[1], callback);
        },
        function(callback) {
			itemInstanceCreate(items[1], "Available", colors[2], callback);
        }
	],
        // Optional callback
    cb);
}



async.series([
    createCategories,
	createColors,
	createItems,
	createItemsInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Item Instances: ' + itemInstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});







const express = require('express')
const app = express()
const port = 3000
var fs= require('fs')
const user = require ('./users.json')
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');



/*const jsonReaderModule = require('../jsonReaderModule.js');
var filename = '../users.json';*/


app.set ('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false}));
//app.use(cookieParser());


//Route 1: get request that renders all your users

app.get('/', function(request, response) {
	fs.readFile('./users.json', function(err, data) {
		if (err) {
			throw(err);
		}
		var parsedData = JSON.parse(data);
		response.render("index", {parsedData});
    });
    
});  

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))


//Route 2: I create a new ejs file to have the functional search bar
app.get('/search', function(request, response) {
    response.render('search');
}); // We are calling the search.ejs page


//Route 3: Takes post request from the form and displaying matches on new page.Users should be matched based on whether either their first or last name contains the input string.

app.post('/search', function(request, response) {
	fs.readFile('./users.json', (err,data) => {
		if (err) {throw err}

		const parsedData = JSON.parse(data);
		const result = [];
			for (let i = 0; i < parsedData.length; i++) {
				if (parsedData[i].firstname.indexOf(request.body.input) > -1 
					|| parsedData[i].lastname.indexOf(request.body.input) > -1 === request.body.input) {
					result.push(parsedData[i]);
					console.log(result);
				}
			}
		response.render('matches2', {result});
	})
});

//live search
// Part 1: Autocomplete
// Modify your form so that every time the user enters a key, it makes an AJAX call that populates the search results.

app.post('/suggestionFinder', function(req,res){
	//var suggest = ''
	fs.readFile('./users.json', function (error, data) {
		if (error) {
			console.log("error");
		}
		const parsedData = JSON.parse(data);
        const result = [];

            for (let i = 0; i < parsedData.length; i++) {
                if (parsedData[i].firstname.indexOf(req.body.input) > -1
                    || parsedData[i].lastname.indexOf(req.body.input) > -1 === req.body.input) {
                    result.push(parsedData[i]);
                    console.log(result);
                }
            }
        res.send(result);
    })
});
        

// I create a new ejs file to display the matching users 
app.get('/matches2', function(request, response) {
	response.render('matches2');
});

//Route 4: renders a page with three inputs on it (first name, last name, and email) that allows you to add new users to the users.json file.
app.get('/addUser2', function(request, response) {
	response.render('addUser2');
});


//Route 5: Takes in the post request from the 'create user' form, then adds the user to the users.json file. Once that is complete, redirects to the route 
app.post('/addUser2', function (request, response) {
	fs.readFile('./users.json', (err, data) => {
		if (err) {throw err}

		let parsedData = JSON.parse(data);
		
		let newUser = { //add user
			firstname: request.body.inputfirst,
			lastname: request.body.inputlast,
			email: request.body.inputemail,
		}
		// to push a new user to the array in .json file
		parsedData.push(newUser);

		let json = JSON.stringify(parsedData);

		fs.writeFile('./users.json', json, (err) => {
			if (err) {throw err}
		})
	})
	response.redirect('/');
});



//Server:
app.listen (port, () => console.log(`Listening on port: ${port}`));




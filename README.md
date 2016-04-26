# project_alpha

## CS411 Project - Team 9 

Nadav Hazan, Christine Low, Ying Hang Eng, Max Bazik


## Web Based Application - Boston University

## Project Assignment 5
SEQUENCE DIAGRAMS: check out word file called  S Diagram - Project 5 

Our commented JSON schema: 

var mongoose     = require('../mongoose');

var Schema       = mongoose.Schema;

// events schema 
var EventSchema   = new Schema({
	
	name: String,
	
	location: String,
	
	id: { type: String, index: { unique: true }},
	
	start: String
});

It's also important to note that as our team continued to develop, our idea began to pivot as well. We talked to several students on campus and wanted to hear what they really wanted. Also, with the amount of time we had in the semester, and our team's eagerness to work together on the project, we really wanted to focus on the principle of your application. We wanted to make sure our application allows our users an easy login, an ability to search for events, and an ability to sync their calendars to better pick events that work best for them when they are free.




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

We added documentation on our minutes, a gantt chart on how we would plan to move on with the project if we were here of the summer and looking to further develop it, and a documentation on our pivots. The structure of your source repository can be demonstrated by the folders we have in the respository here on Gitbub, and the configuration documents are shown in config.js as well as throughout the schema of the project. 

All of our team's documentation is included. The files are in the main repository, and many of the documentation have the word "documentation" or "assignment" or "screenshot" next to them. We also created a folder called "Extra Doucmentation" where the documentation can be pulled. 

Some of the main documentation files are: 

Architecture : Prototype Documentation

s Diagram - Project 5

Team 9 Use Case

Screenshot - Boston Search

Assignment 6 Testing Documentation

Plans for next version - Gantt Chart Documentation

Team Meeting Minutes

Team 9 Pivot Documentation


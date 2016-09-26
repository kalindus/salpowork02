var mongoose = require("mongoose");
var Todo = require('../models/Todo.js');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();


chai.use(chaiHttp);

describe('Todos', function(){

    beforeEach(function(done){ 
        Todo.remove({}, function(err){ 
           done();         
        });     
    });



	describe('/GET todo', function() {
		it('it should GET all todo items', function (done) {
			chai.request(server)
            	.get('/todos')
				.end(function (err, res) {
					res.should.have.status(200);
                	res.body.length.should.be.eql(0);
                	res.body.should.be.a('array');
                   done();
				});
		});
	});

});
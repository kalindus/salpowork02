process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Todo = require('../models/Todo.js');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();


chai.use(chaiHttp);

describe('Todos', function(){

    beforeEach(function(done){ 
        var newTodo = new Todo({ 
           name: 'Task1',
           completed: false   
        });
        newTodo.save(function(err){
          done();
        });     
    });

    afterEach(function(done){
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
              res.body.length.should.be.eql(1);
              res.body.should.be.a('array');
              res.body[0].should.have.property('_id');
              res.body[0].should.have.property('name');
              res.body[0].should.have.property('completed');
              res.body[0].name.should.equal('Task1');
              res.body[0].completed.should.be.false;
            done();
          });
    });
  });

  describe('/POST todo', function() {
    it('it should add a single todo item on /todos', function (done) {
      chai.request(server)
          .post('/todos')
          .send({'name' :'TaskT', 'completed' : false})
          .end(function (err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('_id');
              res.body.should.have.property('name');
              res.body.should.have.property('completed');
              res.body.name.should.equal('TaskT');
              res.body.completed.should.be.false;
            done();
          });
    });
  });

    describe('/GET/:id todo', function() {
    it('it should list a single todo item on /todos', function (done) {
      var newTodo = new Todo({ 
           name: 'Task2',
           completed: false      
        });
      newTodo.save(function(err, data){
        chai.request(server)
          .get('/todos/'+data.id)
          .end(function (err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('_id');
              res.body.should.have.property('name');
              res.body.should.have.property('completed');
              res.body.name.should.equal('Task2');
              res.body.completed.should.be.false;
              res.body._id.should.equal(data.id);
            done();
      });
      
          });
    });
  });


  describe('/PUT/:id todo', function() {
    it('it should update a single todo item on /todos', function (done) {
      chai.request(server)
          .get('/todos')
          .end(function (err, res) {
            chai.request(server)
                .put('/todos/'+res.body[0]._id)
                .send({'name' : 'TaskU'})
                .end(function(err, res){
                    chai.request(server)
                    .get('/todos')
                    .end(function(err, res){
                      res.should.have.status(200);
                      res.body[0].should.be.a('object');
                      res.body[0].should.have.property('_id');
                      res.body[0].should.have.property('name');
                      res.body[0].should.have.property('completed');
                      res.body[0].name.should.equal('TaskU');
                      res.body[0].completed.should.be.false;
                      done();
                    });                      
                });
          });
    });
  });

  describe('/DELETE/:id todo', function() {
    it('it should remove a single todo item on /todos', function (done) {
      chai.request(server)
          .get('/todos')
          .end(function (err, res) {
            chai.request(server)
                .delete('/todos/'+res.body[0]._id)
                .end(function(err, res){
                    chai.request(server)
                    .get('/todos')
                    .end(function(err, res){
                      res.should.have.status(200);
                      res.body.should.be.a('array');
                      res.body.should.be.empty;
                      done();
                    });  
                });
          });
    });
  });

});
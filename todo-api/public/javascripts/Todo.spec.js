describe('TodoController', function() {

  'use restrict';
  
  var httpBackend, controller, rootscope, scope, mockTodos;
  var todos = [
      {
        _id:1,
        name: 'Task1',
        completed: false,
      }, {
        _id:2,
        name: 'Task2',
        completed: false,
      },{
        _id:3,
        name: 'Task3',
        completed: true,
      },];
    var index = 0;
  
  beforeEach(function(){

    module('app');

    inject(function($httpBackend, $rootScope, $controller, Todos){
      
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      mockTodos = Todos;

      controller = $controller('TodoController', {
        $scope: scope,
        Todos: mockTodos
      });

      httpBackend.whenGET('/todos').respond(todos);

      httpBackend.whenPOST('/todos').respond(function(method, url, data) {
        var newTodo = angular.fromJson(data);
        todos.push(newTodo);

        return [200, newTodo, {}];
      });

    httpBackend.whenGET(/\/todos\/(\d+)/, undefined, ['id']).respond(function(method, url, data, headers, params) {
        var todo = todos[params.id];

        if (todo === null) {
        return [404, undefined, {}];
        }

        return [200, contact, {}];
        });
    });

    httpBackend.whenPUT(/\/todos\/(\d+)/, undefined, ['id']).respond(function(method, url, data, headers, params){
        var todo = todos[params.id],
            parsedData = angular.fromJson(data);

        if (todo === null) {
          return [404, undefined, {}];
        }

        angular.extend(todo, parsedData);

        return[200, todo, {}];

    });

    httpBackend.whenDELETE(/\/todos\/(\d+)/, undefined, ['id']).respond(function(method, url, data, headers, params){
        var todo = todos[params.id];

        if (todo === null) {
          return [404, undefined, {}];
        }

        todos.splice(todos.indexOf(todo), 1);

        return[200, todo, {}];

    });

  });


  it('checks todos and editing', function() {
    expect(scope.todos).toBeDefined();
    expect(scope.editing).toEqual([]);
  });


  it('checks if Todos is defined', function() {
      expect(mockTodos).toBeDefined();
  });


  it('checks for $resource functions - query, $save, update, ', function() {
      var output = mockTodos;
      expect(output).toEqual(jasmine.any(Function));

      expect(output.query({
              term: 'q'
      }.$promise)).toBeDefined();

      expect(output.save({
              term: 'q'
      }.$promise)).toBeDefined();

      expect(output.update({
              term: 'q',
      }.$promise)).toBeDefined();
  });


  it('returns mocked todo items', function(){
      httpBackend.flush();
      expect(scope.todos.length).toEqual(3);
      expect(scope.todos[0].name).toEqual("Task1");
      expect(scope.todos[1].name).toEqual("Task2");
  });


  describe('$scope.add', function() {

    it('adds a todo item into $scope.todos', function() {
      scope.newTodo = 'Task10';
      scope.add();
      httpBackend.flush();
      expect(scope.todos.length).toEqual(4);
    });
  });

  describe('$scope.update', function(){
    it('updates an existing item', function(){
      httpBackend.flush();
      var todo = scope.todos[index];
      scope.update(index);      
      expect(scope.editing[index]).toBeFalsy();
    });
  });

  describe('$scope.markall', function(){
    it('updates all items', function(){
      httpBackend.flush();
      var todo = scope.todos[index];
      var allCompleted = true;

      scope.markall(allCompleted);
      expect(todo.completed).toBeTruthy();
    });
  });

  describe('$scope.edit', function(){
    it('edits an existing item', function(){
      httpBackend.flush();
      scope.edit(index);
      expect(scope.editing[index].name).toEqual(scope.todos[index].name);
    });
  });

  describe('$scope.cancel', function(){
    it('cancel the update of an existing item', function(){
      httpBackend.flush();
      scope.cancel(index);
      expect(scope.editing[index]).toBeFalsy();
    });
  });

  describe('$scope.remove', function(){
    it('deletes an existing item', function(){
      httpBackend.flush();
      var todo = scope.todos[index];
      scope.remove(index);
      expect(scope.todos.length).toEqual(4);
    });
  });


});

describe('Testing routes', function(){
  var $route, $rootScope, $location, $httpBackend;

  beforeEach(function(){
    module('app');

    inject(function($injector){
      $route = $injector.get('$route');
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');
      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.when('GET', '/todos.html').respond('/');
    });
  });

  it('should navigate to starting page', function(){
    $rootScope.$apply(function(){
      $location.path('/');
    });
    expect($location.path()).toBe('/');
    expect($route.current.templateUrl).toBe('/todos.html');
    expect($route.current.controller).toBe('TodoController');
  });

});

describe('Testing status filter ', function() {

  'use strict';
  var $filter;
  var array = [
      {
        id:1,
        name: 'Task1',
        completed: false
      },{
        id:2,
        name: 'Task2',
        completed: true
      },];

  beforeEach(function () {
    module('app');

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  it('should display only completed items when the value is true', function(){
    var completed = $filter('statusFilter')(array, true);

    expect(completed[0].name).toEqual('Task2');
  });

  it('should display only active items when the value is false', function(){
    var active = $filter('statusFilter')(array, false);

    expect(active[0].name).toEqual('Task1');
  });
});


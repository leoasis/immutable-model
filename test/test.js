import { Collection, Model } from '../src'
import assert from 'assert'

var Person = function Person(values) {
  if (!(this instanceof Person)) return new Person(values);
  this._defaultValues.name = 'John';
  this._defaultValues.age = 12;
  Model.call(this, values);
}
Person.prototype = Object.create(Model.prototype);
Person.prototype.constructor = Person;
Person.prototype._name = 'Person';

Person.prototype.sayHello = function() {
  return 'Hello ' + this.get('name');
}

var models = [
  Person({id: 323, cid: 'c1', name: 'Foo'}),
  Person({id: 111, cid: 'c2', name: 'Bar'}),
  Person({id: 434, cid: 'c3', name: 'Baz'})
];

var c = Collection();

c = c.set(models[0]).set(models[1]).set(models[2]);

assert.equal(c.size, 3, 'Can get the size');
assert.equal(c.set(Person({id: 1, cid: 'c4'})).size, 4, 'Can get the size, after update');

assert.deepEqual(c.map(function(model) {
  return model.get('name');
}).toArray(), ['Foo', 'Bar', 'Baz'], 'Can map over the models to get the names');

assert.equal(c.get(111), models[1], 'Can get the model by id 111');

assert.equal(c.get('c3'), models[2], 'Can get the model by cid c3');

assert.equal(c.set(models[0]), c, 'Can set the same model and it returns the same instance');

assert.notEqual(c.set(models[0].set('name', 'Updated Foo')), c, 'Can set a new model and it returns a different instance');

assert.equal(c.delete(323).size, 2, 'Can remove models by id');
assert.equal(c.remove(323).size, 2, 'Can remove models by id');
assert.equal(c.remove(323).get(323), undefined, 'Model is actually removed');

assert.equal(c.delete('c2').size, 2, 'Can remove models by cid');
assert.equal(c.remove('c2').size, 2, 'Can remove models by cid');
assert.equal(c.remove('c2').get('c2'), undefined, 'Model is actually removed');

assert.equal(c.remove('notExists'), c, 'Removing something that does not exist does nothing');
console.log('All tests ok!');

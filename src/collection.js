import Immutable from 'immutable'

export default class Collection {
  constructor(values) {
    var byId = {};
    values = values || [];
    var modelsByCid = Immutable.OrderedMap(values.reduce(function(acc, model) {
      acc[model.cid] = model;
      byId[model.id] = model.cid;
    }, {}));
    byId = Immutable.Map(byId);

    return makeCollection(modelsByCid, byId);
  }

  set(model) {
    var id = model.get('id');
    var cid = model.get('cid');
    return updateCollection(this, this._modelsByCid.set(cid, model), this._byId.set(id, cid));
  }

  get(cidOrId) {
    return this._modelsByCid.get(cidOrId) || this._modelsByCid.get(this._byId.get(cidOrId));
  }

  remove(cidOrId) {
    var cid = this._byId.get(cidOrId); // if cidOrId is an id
    if (cid != undefined) {
      return updateCollection(this, this._modelsByCid.remove(cid), this._byId.remove(cidOrId));
    } else {
      // cidOrId is not an id, or the id is not in this collection
      return updateCollection(this, this._modelsByCid.remove(cidOrId), this._byId);
    }
  }


  map() {
    return this._modelsByCid.map.apply(this._modelsByCid, arguments);
  }
}

Collection.prototype.delete = Collection.prototype.remove;

function updateCollection(coll, modelsByCid, byId) {
  if (coll._modelsByCid === modelsByCid && coll._byId === byId) {
    return coll;
  }
  return makeCollection(modelsByCid, byId);
}

function makeCollection(modelsByCid, byId) {
  var newColl = Object.create(Collection.prototype);
  newColl._modelsByCid = modelsByCid;
  newColl._byId = byId;
  newColl.size = modelsByCid.size;
  return newColl;
}

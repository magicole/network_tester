var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/testProject';
MongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    console.log("connected successfully");
    //db.close();
    //insertDocuments(db, function(db, function(db){db.close();});
    insertDocuments(db, function(result){
        getDocuments(db, function(docs){db.close()});
    });
    //db.close();
});

var insertDocuments = function(db, callback){
    var collection = db.collection('documents');
    collection.insertMany([
	    {a: 1}, {a: 2}, {a: 3}
    ], function(err, result){
	    assert.equal(err, null);
	    assert.equal(3, result.result.n);
	    assert.equal(3, result.ops.length);
	    console.log("inserted 3 documents");
	    callback(result);
    });
}

var getDocuments = function(db, callback){
    var collection = db.collection('documents');
    collection.find({'a': 3}).toArray(function(err, docs){
        assert.equal(err, null);
        console.log("Found The following records:");
        console.log(docs);
        callback(docs);
    })
}
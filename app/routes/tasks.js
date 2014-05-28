/* jshint unused: false */
'use strict';

var tasks = global.nss.db.collection('tasks');
var priorities = global.nss.db.collection('priorities');
var Mongo = require('mongodb');
var _ = require('lodash');

exports.titlesort = (req, res)=>{
  var _pid = Mongo.ObjectID(req.params.pid);
  tasks.find({}, {sort:[['title',1]]}).toArray( (err,t)=> {
    priorities.find().toArray( (err,p)=>{
      t = t.map(task => {
        task.priority = _(p).find(pri => pri._id.toString() === task.priorityId.toString() );
        if(task.priority===undefined) {
          task.priority = {name:'Default', color:'grey'};
        }
        return task;
      });

      res.render('tasks/index', {priorities: p, tasks: t, title: 'Tasks'});
    });
  });
};


exports.datesort = (req, res)=>{
  var _pid = Mongo.ObjectID(req.params.pid);
  tasks.find({}, {sort:[['due',1]]}).toArray( (err,t)=> {
    priorities.find().toArray( (err,p)=>{
      t = t.map(task => {
        task.priority = _(p).find(pri => pri._id.toString() === task.priorityId.toString() );
        if(task.priority===undefined) {
          task.priority = {name:'Default', color:'grey'};
        }
        return task;
      });

      res.render('tasks/index', {priorities: p, tasks: t, title: 'Tasks'});
    });
  });
};



exports.filter = (req, res)=>{
  var _pid = Mongo.ObjectID(req.params.pid);
  tasks.find({priorityId:_pid}).toArray( (err,t)=> {
    priorities.find().toArray( (err,p)=>{
      t = t.map(task => {
        task.priority = _(p).find(pri => pri._id.toString() === task.priorityId.toString() );
        if(task.priority===undefined) {
          task.priority = {name:'Default', color:'grey'};
        }
        return task;
      });

      res.render('tasks/index', {priorities: p, tasks: t, title: 'Tasks'});
    });
  });
};

exports.update = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);
  tasks.findOne({_id:_id}, (e,t)=>{
    t.isComplete = !t.isComplete;
    tasks.save(t, ()=>res.redirect('/tasks'));
  });
};

exports.destroy = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);
  tasks.findAndRemove({_id:_id}, ()=>res.redirect('/tasks'));
};

exports.index = (req, res)=>{
  tasks.find().toArray( (err,t)=> {
    priorities.find().toArray( (err,p)=>{
      t = t.map(task => {
        task.priority = _(p).find(pri => pri._id.toString() === task.priorityId.toString() );
        if(task.priority===undefined) {
          task.priority = {name:'Default', color:'grey'};
        }
        return task;
      });

      res.render('tasks/index', {priorities: p, tasks: t, title: 'Tasks'});
    });
  });
};

exports.create = (req, res)=>{
  req.body.isComplete = false;
  req.body.due = new Date(req.body.due);
  req.body.priorityId = Mongo.ObjectID(req.body.priorityId);

  tasks.save(req.body, ()=>res.redirect('/tasks'));
};

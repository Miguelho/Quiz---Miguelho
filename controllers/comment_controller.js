var models= require('../models/models.js');
//Autoload :id de comentarios
exports.load= function (res,req,next,commentId){
  models.Comment.find({
    where: {
      id: Number(commentId)
    }
  }).then(function(comment){
    if(comment){
      req.comment = comment;
      next();
    } else{next(new Error('No existe commentId= ' + commentId))}

  }).catch(function(error){next(error)});


}


// GET /quizes/:quizId/cooments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/commentss
exports.create = function(req, res) {
  var comment = models.Comment.build( {
      texto: req.body.comment.texto,
      QuizId: req.params.quizId
  });

  if (!req.body.comment.texto){
    console.log("CONSOLE LOG : !req.params.quizId" + req.params.quizId);
    res.redirect('/quizes/' + req.params.quizId)
  }

  comment.validate().then(function(err){
    if (err) {
      res.render('comments/new.ejs', {comment: comment, errors: err.errors});
    } else {
      comment // save: guarda en DB campos texto de comment
      .save().then(function(){ res.redirect('/quizes/' + req.params.quizId)})
    }      // res.redirect: Redirección HTTP a lista de preguntas
  }).catch(function(error){next(error)});
};


exports.publish = function (req,res){
  req.comment.publicado = true;
  req.comment.save({ fields : ["publicado"]})
    .then (function(){res.redirect('/quizes/' + req.params.quizId);})
      .catch(function(error){next (error)});

}

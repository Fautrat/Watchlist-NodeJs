var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display media page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM media ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/media/index.ejs
            res.render('media',{data:''});   
        } else {
            // render to views/media/index.ejs
            res.render('media',{data:rows});
        }
    });
});

// display add video page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('media/add', {
        name: '',
        type: ''        
    })
})

// add a new video
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let type = req.body.type;
    let errors = false;

    if(name.length === 0 || type.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter the name and select the good type of video");
        // render to add.ejs with flash message
        res.render('media/add', {
            name: name,
            type: type
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            type: type
        }
        
        // insert query
        dbConn.query('INSERT INTO media SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('media/add', {
                    name: form_data.name,
                    type: form_data.type                    
                })
            } else {                
                req.flash('success', 'New video added');
                res.redirect('/media');
            }
        })
    }
})

// display edit video page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM media WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Video not found with id = ' + id)
            res.redirect('/media')
        }
        // if video found
        else {
            // render to edit.ejs
            res.render('media/edit', {
                title: 'Edit Video', 
                id: rows[0].id,
                name: rows[0].name,
                type: rows[0].type
            })
        }
    })
})

// update video data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let type = req.body.type;
    let errors = false;

    if(name.length === 0 || type.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter the name of the video and select the type");
        // render to add.ejs with flash message
        res.render('media/edit', {
            id: req.params.id,
            name: name,
            type: type
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            type: type
        }
        // update query
        dbConn.query('UPDATE media SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('media/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    type: form_data.type
                })
            } else {
                req.flash('success', 'Video successfully updated');
                res.redirect('/media');
            }
        })
    }
})
   
// delete video
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM media WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to media page
            res.redirect('/media')
        } else {
            // set flash message
            req.flash('success', 'Video successfully deleted! ID = ' + id)
            // redirect to media page
            res.redirect('/media')
        }
    })
})

module.exports = router;


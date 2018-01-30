const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/edx-course-db',{})

const Account = mongoose.model('account',
    {
        name: String,
        balance: Number,
    },
)

  //setting middlewares
  app.use(bodyParser.json())
  app.use(logger('dev'))
  app.use(errorhandler())


  //helper method - used when account is not found
  const errAccountNotFound = (res,id) => {
    console.log("account does not exist id", id)
    res.status(404).send()
  }

  //get all accounts
  app.get('/accounts', (req, res) => {
    var allAccounts = Account.find({}, (error,accounts) => {
      if (error) {
        console.error(error)
        res.status(500)
      }  
      res.status(200).send(accounts)
    })    
  })

  //create new account
  app.post('/accounts', (req, res) => {
 
    //creating new account object
    var newAccount = new Account({name:req.body.name,balance:req.body.balance});
    
    newAccount.save((error, result) => {
      if (error) {
        console.error(error)
        res.status(500)
      }else{
        //sending mongo object id
        res.status(201).send({id: newAccount._id})
      }
  })
  
  })

  //update an existing account
  app.put('/accounts/:id', (req, res) => {
    
    let id = req.params.id;
    //finding the required account
    Account.findById(id,  (err, updateAccount) => {
      if (!updateAccount || err) {
        errAccountNotFound(res,id);
      }else{
      
        //updating the necessary parameters(if exist)
        if(req.body.balance)
          updateAccount.balance = req.body.balance
        if(req.body.name)
          updateAccount.name = req.body.name

          updateAccount.save((error, result) => {
            if (error) {
              console.error(error)
              res.status(500)
            }else{
              res.status(200).send(result)  
            }
        } );
      }
    });
  
  })

  //delete account by id
  app.delete('/accounts/:id', (req, res) => {
      let id = req.params.id

      Account.remove({"_id":id} , (err) => {
        if(err){
          console.error(error)
          errAccountNotFound(res,id);
        }else{
          res.status(204).send()
        }
      })
  })

 

  app.listen(3000)
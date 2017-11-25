const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const routes =  require(path.join(__dirname, 'routes'))
const posts = routes.posts
const commentsHandler = routes.commentsHandler

//initalizing the store
let store = {
    posts: [
      {name: 'Top 10 ES6 Features every Web Developer must know',
      url: 'https://webapplog.com/es6',
      text: 'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
      comments: [
        {text: 'Cruel…..var { house, mouse} = No type optimization at all'},
        {text: 'I think you’re undervaluing the benefit of ‘let’ and ‘const’.'},
        {text: '(p1,p2)=>{ … } ,i understand this ,thank you !'}      
      ]
      }
    ]
  }

  //adding the store to the request object
  const addStoreToReqMiddleWare = (request, response, next) => {
    request.store = store
    next()
  }

  //setting middlewares
  app.use(bodyParser.json())
  app.use(logger('dev'))
  app.use(errorhandler())
  app.use(addStoreToReqMiddleWare)

  //routes

  app.get('/posts', (req, res) => {
    posts.getPosts(req,res)
  })

  app.post('/posts', (req, res) => {
    posts.addPost(req,res)
  })

  app.put('/posts/:postId', (req, res) => {
    posts.updatePost(req,res)
  })

  app.delete('/posts/:postId', (req, res) => {
    posts.removePost(req,res)
  })

  app.get('/posts/:postId/comments', (req, res) => {
    commentsHandler.getComments(req,res)
  })

  app.post('/posts/:postId/comments', (req, res) => {
    commentsHandler.addComment(req,res)
  })

  app.put('/posts/:postId/comments/:commentId', (req, res) => {
    commentsHandler.updateComment(req,res)
  })

  app.delete('/posts/:postId/comments/:commentId', (req, res) => {
    commentsHandler.removeComment(req,res)
  })



  app.listen(3000)
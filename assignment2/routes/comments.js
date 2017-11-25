
const errResourceNotFound = (res,objectName,id) => {
  console.log(objectName," does not exist id:", id)
  res.status(404).send()
}

module.exports = {
  getComments(req, res) {
    let postId = req.params.postId
    let posts = req.store.posts

    if (posts[postId]) {
      if(!posts[postId].comments){
        posts[postId].comments = []
      }
      res.status(200).send(posts[postId].comments)
    } else{
      errResourceNotFound(res,'post',postId)
    }
  },
  addComment(req, res) {
    let newComment = req.body
    let postId = req.params.postId
    let posts = req.store.posts
    
    if(posts[postId]){
      if(!posts[postId].comments){
        posts[postId].comments=[]
      }
        (posts[postId].comments).push(newComment)
        res.status(201).send()
    }else{
      errResourceNotFound(res,'post',postId)
    }
  },
  updateComment(req, res) {
    let newComment = req.body
    let postId = req.params.postId
    let commentId = req.params.commentId
    let posts = req.store.posts
   
    if(posts[postId]){
        if(posts[postId].comments[commentId]){
            posts[postId].comments[commentId] =newComment
            res.status(200).send(posts[postId].comments[commentId])
        }else{
          errResourceNotFound(res,'comment',commentId)
        }
    }else{
      errResourceNotFound(res,'post',postId)
    }
  },
  removeComment(req, res) {
    let postId = req.params.postId
    let commentId = req.params.commentId
    let posts = req.store.posts
    if(posts[postId]){
        if(posts[postId].comments[commentId]){
            posts[postId].comments.splice(commentId, 1)
            res.status(204).send()
        }else{
          errResourceNotFound(res,'comment',commentId)
        }
    }else{
      errResourceNotFound(res,postId)
    }
  }
}
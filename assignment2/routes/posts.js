const errPostNotFound = (res,postId) => {
    console.log("post does not exist id", postId)
    res.status(404).send()
  }
  


module.exports = {
    getPosts(req, res) {
         res.status(200).send(req.store.posts)
    },
    addPost(req, res) {
        let posts = req.store.posts
        let newPost = req.body
        let postId = posts.length

        //add the post object to the store
        posts.push(newPost)
        res.status(201).send({postId: postId})
    },
    updatePost(req, res) {
        let posts = req.store.posts
        let postId = req.params.postId
        let newPost = req.body

        if(posts[postId]){
            posts[postId] = newPost
            res.status(200).send(posts[postId])
        }else{
            errPostNotFound(res,postId)
        }
    },

    removePost(req, res) {
        let posts = req.store.posts
        let postId = req.params.postId

        if(posts[postId]){
            posts.splice(postId, 1)
            res.status(204).send()
        }else{
            errPostNotFound(res,postId)
        }
    }
  }
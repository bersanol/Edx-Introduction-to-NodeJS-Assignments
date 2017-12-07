const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
var path = require('path')
var mergeJSON = require("merge-json") ;
var async = require("async");
const uuidv1 = require('uuid/v1')


//loading the json files
var customers = require(path.join(__dirname,'m3-customer-data.json'))
var addresses = require(path.join(__dirname,'m3-customer-address-data.json'))

// Connection URI
const url = 'mongodb://localhost:27017/assignment3'

//array holds async task to be executed
var asyncTasks = [];

/**
 * This method insert full costomer data to the database
 * @param {*} db - the db instance insert
 * @param {*} collectioName - target collection name
 * @param {*} customerData  - chunk of customer data to insert
 * @param {*} callback 
 */
const insertCustomers = (db,collectioName,customerData,callback) => {
 
    // Get reference to collection
    const collection = db.collection(collectioName)
    
    // bulk insert of customers
    collection.insertMany( customerData, (error, result) => {
      if (error) {
          console.log(error)
          return process.exit(1)
      }
      callback(result)
    })}


/**
 * This helper method merge the customer and adresses json objects
 * @param {*} customers 
 * @param {*} addresses 
 */
const mergeChunks = ( customers, addresses) => {
    var res = []

    //going over all customers and merging the addresses
    for ( j = 0 ; j < customers.length ; j++){
        res.push( mergeJSON.merge(customers[j], addresses[j]))
    }
    return res
}


/**
 * This method has two phases:
 *  phase 1 (synchronized):
 *         1. split the customers and adresses to json smaller chunks
 *         2. for each chunk merge the address and customer into one json object
 *         3. create async task which will insert the merged chunk
 * 
 * phase 2 (async)
 *          1. run the async task in parallel mode
 * 
 * @param {*} chunkSize - the required size to divide the json object
 * @param {*} db  - db instance
 * @param {*} collectioName - target collection name
 */
const migrateDb = (chunkSize,db,collectioName) => {
    var asyncTasks = []

    //phase 1
    for (i = 0 ; i < customers.length ; i = i + chunkSize){
        const customerChunk = customers.slice(i,i+chunkSize)
        const addressChunk = addresses.slice(i,i+chunkSize)
        const merge = mergeChunks(customerChunk,addressChunk)
        asyncTasks.push((callback) => {
            insertCustomers(db,collectioName,merge,()=>{})
        })
    }


    //phase 2
    async.parallel(asyncTasks, (error, results) => {
        if (error) console.error(error)
      })
}


// Use connect method to connect to the Server
MongoClient.connect(url, (err, db) => {
  if (err) {
      console.log('error - could not connect to DB ',url)
      return process.exit(1)
    }
  
  const name = uuidv1()
  console.log('Connected successfully to server' ,url)
  console.log('attempting migrate to database: assignment3 collection name: ',name)
  migrateDb(process.argv[2],db,name) 

  db.close()
})



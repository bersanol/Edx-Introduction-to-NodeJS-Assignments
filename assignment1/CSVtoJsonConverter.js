const fs = require('fs')
const path = require('path')

//this array holds the output json objects
var arr = []

//arr for json keys (csv columns)
var keys

//indicate the line we currently parsing in the csv
var lineNum = 1

//this method combine the json keys with it's corresponding values
const joinKeyValueArrays = (keysArr, valuesArr ) => {
    
    item = {}
    for(i = 0 ; i < keysArr.length ; i++){
        item[keysArr[i]]=valuesArr[i]
    }

    arr.push(item);   
}

/*main method 
// 1. read the csv file line by line
// 2. for each line create a json object representing that line
// 3. add the json object to result array
// 4. when we finished reading the csv file - write the array to file
*/ 
const convertCSVToJSON = (file) => {

    //using line reader to read csv file line by line
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(file)
    }).on('line', function (line) {
        
        //split the csv line using the comma seperator
        var lineJson = line.split(',');
        
        if(lineNum == 1){
             //this is the first line - save the array as keys array
            keys = lineJson    
        }else{
             //this line contain csv data - combine it with with column keys
            joinKeyValueArrays(keys,lineJson)
        }

        lineNum++

    }).on('close', function () {
        //write the result to file
        fs.writeFileSync(path.join(__dirname, 'customer-data.json'), JSON.stringify(arr,null,2))  
    });
}



convertCSVToJSON('customer-data.csv')








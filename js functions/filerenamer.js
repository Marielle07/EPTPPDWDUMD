var fs = require('fs');

newArray = [1,1,1,1,1,1,1,1,1,1,1];

var dict = {};

dict["features"] = newArray;
dict["label"] = 1;


for(let i = 1; i<=10; i++)
{
    console.log(i)
    fs.appendFile(`data/`+`sample`+i+`.txt`,JSON.stringify(dict),function(err){
        if(err) throw err;
        console.log("saved!")
    });
}




var text = "-1.04,6.24,-8.29,0.00,0.00,0.00,"; //SAMPLE DATA

console.log(converter(text)); //PRINTS THE RETURNED ARRAY

// This is a function that converts a line of string of
// numbers (seperated by comma) into an array of float.
function converter(text){
    var firstArray = []
    var length = text.length;
    var num = "";
    for(let i =0;i<length;i++){
        if(text[i]!=","){
            var num = num+text[i]
            if(i==(length-1)){
                addToFirstArray(num)
            }
        }
        else{
            addToFirstArray(num)
            num = ""
        }
    }

    function addToFirstArray(num){
        firstArray.push(parseFloat(num));
    }
    return firstArray
}




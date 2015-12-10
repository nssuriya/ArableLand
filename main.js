var fs = require('fs');
var readline = require('readline');
var stream = require('stream');




var instream = fs.createReadStream('WDI_Data.csv');
var outstream1 = fs.createWriteStream("json/landarea.json");
var outstream2 = fs.createWriteStream("json/hectares_person.json");
var outstream3 = fs.createWriteStream("json/hectares.json");
var rl = readline.createInterface(instream,outstream1);

var heading = new Array();
var a=0;
var indiaArable = new Array();
var hectares_person = new Array();
var hectares = new Array();

rl.on('line', function(line) {
  array=line.split(",");
  //var flag = false;
//  var indiaArable = {};

  if(array[0]=="Country Name")
    for(i in array){
      heading[i]=array[i];
    }


  if(array[0]=="India" && array[2]=="Arable land (% of land area)"){
    for(i=4; i<array.length ; i++){
    var temp = new Object();
    temp["year"]=heading[i];
    temp["value"]=parseFloat(array[i]);
    indiaArable.push(temp);
  }
  }

  if(array[0]=="India" && array[2]=="Arable land (hectares per person)"){
    for(i in array){
    var temp = new Object();
    temp["year"]=heading[i];
    temp["value"]=parseFloat(array[i]);
    hectares_person.push(temp);
  }
  }

  if(array[0]=="India" && array[2]=="Arable land (hectares)"){
    for(i in array){
    var temp = new Object();
    temp["year"]=heading[i];
    temp["value"]=parseFloat(array[i]);
    hectares.push(temp);
  }
  }


//Graph2







});

rl.on('close', function(){

   outstream1.write(JSON.stringify(indiaArable));
   outstream2.write(JSON.stringify(hectares_person));
   outstream3.write(JSON.stringify(hectares));

});

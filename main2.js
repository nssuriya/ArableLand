
//Imports
var fs = require('fs');
var stream = require('stream');

//Creating OutStreams for each json file
var outStream1 = fs.createWriteStream("json/indiaArable.json");
var outStream2 = fs.createWriteStream("json/indiaHectaresPP.json");
var outStream3 = fs.createWriteStream("json/indiaHectares.json");
var outStream4 = fs.createWriteStream("json/africaArable.json");
var outStream5 = fs.createWriteStream("json/aggregate.json");

//Creating Instream and Reading Files
var rl = require('readline').createInterface({
  input: require('fs').createReadStream('WDI_Data.csv')
});

var string = fs.readFileSync('continents.json');
var continents =JSON.parse(string);

//Creating global Variables and arrays
var heading = new Array();
var a=0;
var indiaArable = new Array();
var indiaHectaresPP = new Array();
var indHectares = new Array();
var africaArable= new Array();

var master = new Array();
var aggregate = new Object();

//aggregate["YEAR"] = new Object();
aggregate["ASIA"]=new Array();
aggregate["AFRICA"]=new Array();
aggregate["EUROPE"]=new Array();
aggregate["N_AMERICA"]=new Array();
aggregate["S_AMERICA"]=new Array();
aggregate["OCEANIA"]=new Array();

for (i=0;i<56;i++){
  //aggregate.YEAR[i]=0;
  aggregate.ASIA[i]=0.0;
  aggregate.AFRICA[i]=0.0;
  aggregate.EUROPE[i]=0.0;
  aggregate.N_AMERICA[i]=0.0;
  aggregate.S_AMERICA[i]=0.0;
  aggregate.OCEANIA[i]=0.0;
}


//Reading the Main Data

rl.on('line', function(line) {
  currentLine=line.split(",");

  if(currentLine[0]=="Country Name")
    for(i in currentLine){
      heading[i]=currentLine[i];
    //  if(i>=4){
    //  aggregate.YEAR[i-4]=currentLine[i];
    //  }
    }
    else if(currentLine[2]=="Arable land (% of land area)"){

          if(currentLine[0]=="India"){
              for(i=4;i<currentLine.length;i++){
                var obj = new Object();
                obj["YEAR"] =  heading[i];
                obj["VALUE"]=  parseFloat(currentLine[i]);
                indiaArable.push(obj)
                }
          }
          else if(continents[currentLine[0]]==="AFRICA"){
                var objOuter=new Object();
                objOuter["COUNTRYNAME"]=currentLine[0];
                objOuter["ARABLE"]=parseFloat(currentLine[55]);
                africaArable.push(objOuter);
          }
    }
    else if(currentLine[2]=="Arable land (hectares per person)" && currentLine[0]=="India"){
          for(i=4;i<currentLine.length;i++){
          var obj=new Object();
          obj["YEAR"]=heading[i];
          obj["VALUE"]= parseFloat(currentLine[i]);
          indiaHectaresPP.push(obj);
          }
      }
    else if(currentLine[2]=="Arable land (hectares)"){

          if(currentLine[0]=="India"){

            var objOuter=new Object();
            for(i=4;i<currentLine.length;i++){
              var obj=new Object();
              obj["YEAR"]=heading[i];
              obj["VALUE"]= parseFloat(currentLine[i]);
              indHectares.push(obj);
            if(!isNaN(parseFloat(currentLine[i])))
            aggregate.ASIA[i-4]=aggregate.ASIA[i-4]+parseFloat(currentLine[i]);
            //console.log(aggregate.ASIA[i-4]+"  "+parseFloat(currentLine[i]));
            }


          }

          else if(continents[currentLine[0]]==="ASIA"){

            for(i=4;i<currentLine.length;i++)
              if(!isNaN(parseFloat(currentLine[i])))
              aggregate.ASIA[i-4]=aggregate.ASIA[i-4]+parseFloat(currentLine[i]);
            }

          else if(continents[currentLine[0]]==="AFRICA"){
            for(i=4;i<currentLine.length;i++)
            if(!isNaN(parseFloat(currentLine[i])))
            aggregate.AFRICA[i-4]=aggregate.AFRICA[i-4]+parseFloat(currentLine[i]);
            }
          else if(continents[currentLine[0]]==="EUROPE"){
            for(i=4;i<currentLine.length;i++)
            if(!isNaN(parseFloat(currentLine[i])))
            aggregate.EUROPE[i-4]=aggregate.EUROPE[i-4]+parseFloat(currentLine[i]);
          }
          else if(continents[currentLine[0]]==="N_AMERICA"){
            for(i=4;i<currentLine.length;i++)
            if(!isNaN(parseFloat(currentLine[i])))
            aggregate.N_AMERICA[i-4]=aggregate.N_AMERICA[i-4]+parseFloat(currentLine[i]);
          }
          else if(continents[currentLine[0]]==="S_AMERICA"){
            for(i=4;i<currentLine.length;i++)
            if(!isNaN(parseFloat(currentLine[i])))
            aggregate.S_AMERICA[i-4]=aggregate.S_AMERICA[i-4]+parseFloat(currentLine[i]);
          }
          else if(continents[currentLine[0]]==="OCEANIA"){
            for(i=4;i<currentLine.length;i++)
            if(!isNaN(parseFloat(currentLine[i])))
            aggregate.OCEANIA[i-4]=aggregate.OCEANIA[i-4]+parseFloat(currentLine[i]);
          }



    }


});

rl.on('close', function(){
  for(i=4;i<60;i++){
    newObj= new Object();
    newObj["Year"]=heading[i];
    newObj["ASIA"]=aggregate.ASIA[i-4];
    newObj["AFRICA"]=aggregate.AFRICA[i-4];
    newObj["EUROPE"]=aggregate.EUROPE[i-4];
    newObj["N_AMERICA"]=aggregate.N_AMERICA[i-4];
    newObj["S_AMERICA"]=aggregate.S_AMERICA[i-4];
    newObj["OCEANIA"]=aggregate.OCEANIA[i-4];
    master.push(newObj)
  }


//console.log(aggregate);
outStream1.write(JSON.stringify(indiaArable));
outStream2.write(JSON.stringify(indiaHectaresPP));
outStream3.write(JSON.stringify(indHectares));
outStream4.write(JSON.stringify(africaArable));
outStream5.write(JSON.stringify(master));


});

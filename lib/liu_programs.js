var http = require('http');
var jsdom = require("jsdom").jsdom();
var $ = require('jquery')(jsdom.parentWindow);

function extractPrograms(htmlStr){
  var $html = $($.parseHTML(htmlStr));
  var $contents = $html.find('#content');

  // Extract year
  var $header = $contents.find('h1');
  var headerText = $header.text();
  var slashPos = headerText.indexOf('/');
  var yearStr = headerText.substring(slashPos-4, slashPos);
  var year = parseFloat(yearStr);

  // Extract programs
  var programs = [];
  var $programCategories = $contents.find('h2');
  var $programLists = $contents.find('ul');

  if($programCategories.length !== $programLists.length){
    return console.error('mismatch number of programCategories and programLists');
  }

  for (var i = 0; i < $programCategories.length; i++) {
    var programCategory = $programCategories[i].textContent;
    var $listItems = $programLists.find('li');

    for (var j = 0; j < $listItems.length; j++) {
      var liText = $listItems[j].textContent;
      var lastCommaIndex = liText.lastIndexOf(',');
      var programTitel = liText.substring(0, lastCommaIndex);

      programs.push({
        category: programCategory,
        title: programTitel,
        year: year
      });
    };
  };

  return programs;
}

function formatCategory(category){
  var civIngStr = 'Civilingenjörsutbildning';
  var kandStr = 'Högskoleingenjörsutbildning';

  if(category.slice(0, civIngStr.length) === civIngStr){
    category = civIngStr + 'ar';
  }
  else if(category === 'Högskoleingenjörsutbildning'){
    category += 'ar';
  }
  else if(category === 'Matematisk-naturvetenkaplig och datavetenskaplig kandidatutbildning' ||
          category === 'Övriga kandidatprogram'){
    category = 'Kandidatutbildningar';
  }

  return category;
}

function extractProgramCodes(htmlStr, year){
  var $html = $($.parseHTML(htmlStr));
  var $tables = $html.find('table');
  var $table = $($tables[$tables.length - 2]);
  var $trs = $table.find('tr');

  var programCodes = [];

  for (var i = 0; i < $trs.length; i++) {
    var $tds = $($trs[i]).find('td');
    var category;

    if($tds.length === 1){
      var unformattedCategory = $tds[0].textContent.trim()
      category = formatCategory(unformattedCategory);
    }

    if($tds.length === 2){
      var code = $tds[0].textContent.trim();
      var title = $tds[1].textContent.trim();
      title = title[0].toUpperCase() + title.substring(1);
      programCodes.push({
        code: code,
        title: title,
        category: category,
        year: year
      });
    }
  };

  return programCodes;
}

/*
function merge(programs, programCodes, callback){
  if(!programs || !programCodes) {
    return;
  }

  for (var i = 0; i < programs.length; i++) {
    var program = programs[i];
    
    for (var j = 0; j < programCodes.length; j++) {
      var programCode = programCodes[j];

      var programTitel = program.title.toLowerCase();
      var titleFraction = programCode.titleFraction.toLowerCase();

      if(programTitel.indexOf(titleFraction) !== -1){
        if(program.code){
          console.log('code already found: ');
          console.log(program.title, programCode.code);
        }
        else{
          program.code = programCode.code;  
        }
      }
    };
    if(!program.code){
      console.log('No code found for ' + program.title);
    }
  };

  callback(null, programs);
}
*/

exports.search = function(year, verbose) {
  var programs;
  var programCodes;

  /*
  var programsUrl = 'http://www.liu.se/utbildning/program/vara-program?l=sv'
  
  console.log('scraping: ' + programsUrl);
  var programsHtmlStr = "";
  http.get(programsUrl, function (res){
    res.on('data', function (chunk) {
      programsHtmlStr += chunk
    });
    res.on('end', function(){
      programs = extractPrograms(programsHtmlStr);
      merge(programs, programCodes, callback);
    });
  });*/
  
  var promise = new Promise(function (resolve, reject){

    var programCodesUrl = 'http://www.lith.liu.se/sh/forkortningar.html';

    if(verbose) console.log('scraping: ' + programCodesUrl);

    var programCodesHtmlStr = "";
    http.get(programCodesUrl, function (res){
      res.on('data', function (chunk) {
        programCodesHtmlStr += chunk
      });
      res.on('end', function(){
        resolve(extractProgramCodes(programCodesHtmlStr, year));
      });
    });
  });
  
  return promise;
};


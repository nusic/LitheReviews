var http = require('http');
var jsdom = require("jsdom").jsdom();
var $ = require('jQuery')(jsdom.parentWindow);



function extractStats(htmlStr, course){

  function extractExamType(ele){
    var $tdElements = $(ele).find('td');
    var descriptionHtml = $($tdElements[0]).html();
    var afterBr = descriptionHtml.substring(descriptionHtml.search(/<br>/)+4);
    var afterColon = afterBr.substring(afterBr.search(/:/)+1);
    return afterColon.substring(0, afterColon.search(/\s\s/));
  }

  function extractExamStats(ele){
    var examStats = {};
    $(ele).find('table tbody tr').each(function(i, tr){
      if(i>0){
        var tdElements = $(tr).find('td');
        var grade = tdElements[0].textContent.trim();
        var frequence = tdElements[1].textContent;
        examStats[grade] = parseFloat(frequence);
      }
    });
    return examStats;
  }

  function addStats(examStats, statsToAdd){
    for (var grade in statsToAdd) {
      if (statsToAdd.hasOwnProperty(grade)) {
        if(examStats[grade]){
          examStats[grade] += statsToAdd[grade];
        }
        else{
          examStats[grade] = statsToAdd[grade];
        }
      }
    }
    return examStats;
  }

  function examToArrays(exam){
    return $.map(exam, function (stats, examType){

      var statsArray = [], 
        gradeOrdering = ['U', 'G', 'D', '3', '4', '5'];
        total = 0;
      gradeOrdering.forEach(function(grade){
        total += stats[grade] || 0;
        if(stats[grade]) statsArray.push({grade: grade, freq: stats[grade] || 0});
      });

      if(total > 0){
        return [{examType: examType, stats: statsArray, total: total}];
      }
      else return [];
    });
  };



  // Scrape the paaaaage!
  var $html = $($.parseHTML(htmlStr));
  var $elements = $html.find('tr:contains("' + course.code + '")');
  $elements = $elements.find('tr:contains("' + course.year + '")');

  var stats = {};

  $elements.each(function(i, ele){
    var examType = extractExamType(ele);
    var examStats = extractExamStats(ele);
    
    if (!stats[examType]){
      stats[examType] = {};
    }

    addStats(stats[examType], examStats);
  });


  var arrays = examToArrays(stats);
  console.log(arrays);
  return arrays;
}

exports.search = function(course, callback) {
  var htmlStr = "";

  var url = 'http://www4.student.liu.se/tentaresult/?kurskod=' + course.code
      + '&provkod=&datum=&kursnamn=&sort=0&search=S';

  http.get(url, function(res){
    res.on('data', function (chunk) {
      htmlStr += chunk
    });
    res.on('end', function(){
      callback(null, extractStats(htmlStr, course));
    });
  });
};




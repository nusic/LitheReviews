var http = require('http');
var jsdom = require("jsdom").jsdom();
var $ = require('jquery')(jsdom.parentWindow);

function extractStats(htmlStr, course){

  /*
  * INPUT:
  *   Takes an TR element containing stats about grades
  *
  * RETURNS:
  *   An array of two elements, exam code and exam name,
  *   respectively. (E.g ['TEN1', 'Skriftlig tentamen'])
  */
  function extractExamCodeAndName(ele){
    var $tdElements = $(ele).find('td');
    var descriptionHtml = $($tdElements[0]).html();
    var afterBr = descriptionHtml.substring(descriptionHtml.search(/<br>/)+4);
    var beforeColon = afterBr.substring(0, afterBr.search(/:/));
    var examCode = beforeColon;
    var afterColon = afterBr.substring(afterBr.search(/:/)+1);
    var examName = afterColon.substring(0, afterColon.search(/\s\s/));
    return [examCode, examName];
  }

  /*
  * INPUT: 
  *   HTML element containing a table of grades and frequencies. 
  *
  * RETURNS: 
  *   An object that has grades (e.g "4" or "U") as property names,
  *   and the frequency as the value of each property as read from 
  *   the table. (E.g {'U': 2, '3':13, '4':4, '5':2} )
  */
  function extractGradeFreqObject(ele){
    var gradeFreqObj = {};
    $(ele).find('table tbody tr').each(function(i, tr){
      if(i>0){
        var tdElements = $(tr).find('td');
        var grade = tdElements[0].textContent.trim();
        var frequence = tdElements[1].textContent;
        gradeFreqObj[grade] = parseFloat(frequence);
      }
    });
    return gradeFreqObj;
  }

  /*
  * INPUT:
  *   examStats: An object with grades as property names
  *              and grade frequency as property values.
  *   statsToAdd: An object with the same for as <examStats>
  *
  * RETURNS:
  *   
  */
  function addGradeFreqObjs(examStats, statsToAdd){
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

  /*
  * INPUT:
  *   An object that maps exam codes to grade frequency object. 
  *   For convenience it is also augmented with examName.
  *
  * OUTPUT:
  *   An array of JSON objects with properties: examCode, name, stats and total.
  *   Stats is itself an array of JSON objects with properties: grade and freq.
  */
  function examsGradeFreqToJSON(examsGradeFreq){
    return $.map(examsGradeFreq, function (gradeFreqObj, examCode){
      var statsArray = [];
      var gradeOrdering = ['U', 'G', 'D', '3', '4', '5'];
      var total = 0;
      gradeOrdering.forEach(function(grade){
        total += gradeFreqObj[grade] || 0;
        if(gradeFreqObj[grade] !== undefined) {
          statsArray.push({
            grade: grade, 
            freq: gradeFreqObj[grade] || 0
          });
        }
      });

      if(total > 0){
        return [{code: examCode, name: gradeFreqObj.name, stats: statsArray, total: total}];
      }
      else return [];
    });
  };

  /*
  * INPUT:
  *   An array of JSON objects with properties: examCode, name, stats and total.
  *   Stats is itself an array of JSON objects with properties: grade and freq.
  *
  * OUTPUT:
  *   An object that maps exam codes to grade frequency object. 
  */
  function jsonToExamsGradeFreq(examsJSON){
    if(!examsJSON) return {};
    
    var examsGradeFreq = {};
    examsJSON.forEach(function(exam){
      examsGradeFreq[exam.code] = {
        name: exam.name
      };
      if(exam.stats){
        exam.stats.forEach(function(data){
          examsGradeFreq[exam.code][data.grade] = data.freq || 0;
        });
      }
    });
    return examsGradeFreq;
  };



  // Scrape the paaaaage!
  var $html = $($.parseHTML(htmlStr));
  var $elementsWithYear = $html.find('tr:contains("' + course.code + '")');
  var $statsElements = $elementsWithYear.find('tr:contains("' + course.year + '")');

  //console.log("INPUT:")
  //console.log(JSON.stringify(course.exams, null, 2));
  //console.log("");

  var examsGradeFreq = jsonToExamsGradeFreq(course.exams);
  //console.log('CONVERTED TO GRADE FREQ:');
  //console.log(JSON.stringify(examsGradeFreq, null, 2));
  //console.log("");

  $statsElements.each(function(i, statsElement){
    var gradeFreqObj = extractGradeFreqObject(statsElement);
    var examCodeAndName = extractExamCodeAndName(statsElement);
    var examCode = examCodeAndName[0];
    var examName = examCodeAndName[1];
    if(!examsGradeFreq[examCode]){
      examsGradeFreq[examCode] = {
        name: examName
      };
    }
    addGradeFreqObjs(examsGradeFreq[examCode], gradeFreqObj);
  });

  //console.log('ADDED STATISTICS GRADE FREQ:');
  //console.log(JSON.stringify(examsGradeFreq, null, 2));
  //console.log("");

  var examStatsJSON = examsGradeFreqToJSON(examsGradeFreq);
  
  //console.log('FINAL RESULT:');
  //console.log(JSON.stringify(examStatsJSON, null, 2));
  //console.log("");


  return examStatsJSON;
}




/*
 * Input: course    Must contain the properties code and year
 *
 */
exports.search = function(course, verbose) {
  if(course.year === undefined){
    course.year = (new Date()).getFullYear();
  }

  var promise = new Promise(function (resolve, reject){
    var htmlStr = "";

    var options = {
        host: 'www4.student.liu.se',
        path: '/tentaresult/?kurskod='+course.code+'&provkod=&datum=&kursnamn=&sort=0&search=S',
        headers: {
            'Accept-Charset' : 'utf8',
        }
    }

    if(verbose) console.log('scraping: ' + options.host + options.path);

    //console.log('scraping: ' + options.host + options.path);
    http.get(options, function (res){
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        htmlStr += chunk
      });
      res.on('end', function(){
        resolve(extractStats(htmlStr, course));
      });
    });
  });
  
  return promise;
};




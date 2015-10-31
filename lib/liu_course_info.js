var http = require('http');
var jsdom = require("jsdom").jsdom();
var $ = require('jquery')(jsdom.parentWindow);

function extractInfo(htmlStr, course){
	var $html = $($.parseHTML(htmlStr));

  var examinatorEle = $html.find('span:contains("Examinator:")').get(0);
  var examinator = examinatorEle.textContent.substring('Examinator: '.length).trim();
  course.prof = examinator || '?';

  var courseSiteEle = $html.find('a:contains("Länk till kurshemsida")').get(0);
  var courseSite = $(courseSiteEle).attr('href');
  course.site = courseSite;

  course.exams = extractExams($html);

  return course;
}

function extractExams($html){
  // We want to find td element containing any of these
  var examGrades = ['(U,3,4,5)', '(U,G)', '(D)'];
  var examTd = null;

  for (var i = 0; i < examGrades.length; i++) {
    examTd = $html.find('td td:contains("' + examGrades[i] + '")').get(0);
    if(examTd !== undefined){
      break;
    }
  };

  //We found the td. 
  var examCodeTd = examTd.parentNode.children[0];
  var namesAndGrades = examTd.innerHTML.split('<br>')
  var _examCodes = examCodeTd.textContent.trim().split('\n');
  var examCodes = _examCodes.filter(function(ele){
    return ele !== '';
  });

  var exams = [];
  for (var j = 0; j < examCodes.length; j++) {
    var examCode = examCodes[j].trim();
    var nameAndGrade = namesAndGrades[j].trim();
    var splitIndex = nameAndGrade.lastIndexOf('(');

    // If a set of possible grades is provided in studiehandboken
    if(splitIndex !== -1){
      var name = nameAndGrade.substring(0, splitIndex).trim();
      var splitIndex2 = nameAndGrade.lastIndexOf(')');
      var grade = nameAndGrade.substring(splitIndex+1, splitIndex2);

      //remove all white space from grade string
      grade = grade.replace(/ /g,'');
      var gradeJsonStr = '["' + grade.split('').join('"') + '"]';
      var gradeArray = JSON.parse(gradeJsonStr);
      
      var stats = [];
      for (var k = 0; k < gradeArray.length; k++) {
        stats.push({
          grade: gradeArray[k]
        });
      };

      exams.push({
        code: examCode,
        name: sanitizeName(name),
        stats: stats 
      });
    }
    else{
      var name = nameAndGrade.trim();
      exams.push({
        code: examCode,
        name: sanitizeName(name),
        stats: undefined
      });
    }
  };

  return exams;
}

function sanitizeName(name){
  // Remove last char if it is not alpha numeric
  if(!/^[a-zA-Z0-9]+$/.test(name[name.length-1])){
    name = name.substring(0, name.length-1);
  }
  return name;
}

function seemsLegit(htmlStr){
  var $html = $($.parseHTML(htmlStr));
  var htmlText = $html.text();
  //Remove white spaces
  htmlText = htmlText.replace(/ /g,'');
  return htmlText.length > 1200;
}

exports.search = function(course, callback) {
	var url = 'http://kdb-5.liu.se/liu/lith/studiehandboken/svkursplan.lasso?'
		+ '&k_budget_year=' + course.year + '&k_kurskod=' + course.code;

  var htmlStr = "";
  http.get(url, function(res){
    res.on('data', function (chunk) {
      htmlStr += chunk
    });
    res.on('end', function(){
      if(seemsLegit(htmlStr)){
        var courseWithInfo = extractInfo(htmlStr, course);  
        callback(null, courseWithInfo);
      }
    	else {
        callback('Could not find ' + course.code, null);
      }      
    });
  });
};


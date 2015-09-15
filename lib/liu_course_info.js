var http = require('http');
var jsdom = require("jsdom").jsdom();
var $ = require('jQuery')(jsdom.parentWindow);

function extractInfo(htmlStr, course){
	var $html = $($.parseHTML(htmlStr));

  var examinatorEle = $html.find('span:contains("Examinator:")').get(0);
  var examinator = examinatorEle.textContent.substring('Examinator: '.length).trim();
  course.prof = examinator;

  var courseSiteEle = $html.find('a:contains("Länk till kurshemsida")').get(0);
  var courseSite = $(courseSiteEle).attr('href');
  course.courseSite = courseSite;

  return course;
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
    	var courseWithInfo = extractInfo(htmlStr, course);
    	if(!courseWithInfo.prof){
    		callback('Could not find ' + course.code, null);
    	}
      callback(null, courseWithInfo);
    });
  });
};


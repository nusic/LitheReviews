var http = require('http');
var jsdom = require("jsdom").jsdom();
var $ = require('jquery')(jsdom.parentWindow);

function extractCourses(htmlStr, year){
  var $html = $($.parseHTML(htmlStr));
  var $trElements = $html.find('tr tr');

  var courseMap = {};
  var period = '';
  $trElements.each(function (i, tr){
    var unfilteredTdTexts = $(tr).text().split(/[\t|\n]+()/);
    var tdTexts = unfilteredTdTexts.filter(function (ele){
      return ele.trim() !== '';
    });
    
    if(tdTexts.length === 1 && 
       tdTexts[0].match(/\d.t\d.?/) && 
       tdTexts[0] !== '1Ht0')
    {
      period = tdTexts[0];
    }
    else if(period && tdTexts.length > 1){
      var last = tdTexts.length-1;
      course = {
        year: year,
        period: period,
        code: tdTexts[0].trim(),
        title: tdTexts[1].trim(),
        level: tdTexts[2].trim(),
        vof: tdTexts[3].trim(),
        block: tdTexts[last-1].trim(),
        hp: parseInt(tdTexts[last]),
      };

      if(tdTexts[last].indexOf('*') !== -1 && courseMap[course.code]){
        courseMap[course.code].period += (' ' + period);
      }
      else{
        courseMap[course.code] = course;
      }
    }
  });

  var courses = Object.keys(courseMap).map(function (key){
    return courseMap[key]
  });

  return courses;
}

//var programmes = ['ACG', 'AER', 'APB', 'ASIENJ', 'ASIENK', 'Bas', 'X', 'BasT', 'BasTC', 'BI', 'Bio', 'BKM', 'BME', 'C', 'CII', 'DE', 'GI', 'KO', 'SN', 'TA', 'COE', 'COM', 'COS', 'CS', 'D', 'DAV', 'DE', 'DI', 'DPU', 'ECO', 'ED', 'EI', 'EL', 'ELE', 'EM', 'ENG', 'ENV', 'ERG', 'ES', 'ETH', 'FL', 'FORE', 'FRIST', 'FT', 'FyN', 'Fys', 'GDK', 'HU', 'I', 'IE', 'Ii', 'IMM', 'IND', 'INN', 'IP', 'IT', 'ITS', 'Jap', 'KA', 'KBI', 'KeBi', 'Kem', 'KI', 'KOS', 'KTS', 'LOG', 'M', 'Mat', 'MEC', 'MED', 'MES', 'MFYS', 'MI', 'MK', 'MMAT', 'MOL', 'MPN', 'MSK', 'MSN', 'MT', 'MuP', 'NO', 'OI', 'PRO', 'SEM', 'SL', 'SOC', 'SUS', 'SY', 'TB', 'TES', 'TL', 'TSL', 'U', 'WNE', 'X', 'XACG', 'XSY', 'Y', 'YDT', 'YH', 'Yi', 'YMP', 'YTHele', 'YTHträ']
exports.search = function(query, callback) {
  
  var url = 'http://kdb-5.liu.se/liu/lith/studiehandboken/action.lasso?'
    + '&-response=lot_response.lasso'
    + '&-op=eq&kp_budget_year=' + query.year
    + '&-op=eq&kp_programkod=' + query.programme
    + '&-op=eq&kp_programprofil=' + query.programme

  console.log('scraping: ' + url);
  var htmlStr = "";
  http.get(url, function (res){
    res.on('data', function (chunk) {
      htmlStr += chunk
    });
    res.on('end', function(){
      callback(null, extractCourses(htmlStr, query.year));
    });
  });
};




var http = require('http');
var jsdom = require("jsdom").jsdom();
var $ = require('jQuery')(jsdom.parentWindow);

function extractCourses(htmlStr){
  var $html = $($.parseHTML(htmlStr));
  var $elements = $html.find('tr[valign="top"]');
  var courses = [];
  $elements.each(function(i, tr){
    var tds = $(tr).find('td');
    courses.push({
      code:   tds.get(1).textContent.trim(),
      title:  tds.get(2).textContent.trim(),
      hp:     tds.get(3).textContent.trim(),
    });
  });
  return courses;
}

//var programmes = ['ACG', 'AER', 'APB', 'ASIENJ', 'ASIENK', 'Bas', 'X', 'BasT', 'BasTC', 'BI', 'Bio', 'BKM', 'BME', 'C', 'CII', 'DE', 'GI', 'KO', 'SN', 'TA', 'COE', 'COM', 'COS', 'CS', 'D', 'DAV', 'DE', 'DI', 'DPU', 'ECO', 'ED', 'EI', 'EL', 'ELE', 'EM', 'ENG', 'ENV', 'ERG', 'ES', 'ETH', 'FL', 'FORE', 'FRIST', 'FT', 'FyN', 'Fys', 'GDK', 'HU', 'I', 'IE', 'Ii', 'IMM', 'IND', 'INN', 'IP', 'IT', 'ITS', 'Jap', 'KA', 'KBI', 'KeBi', 'Kem', 'KI', 'KOS', 'KTS', 'LOG', 'M', 'Mat', 'MEC', 'MED', 'MES', 'MFYS', 'MI', 'MK', 'MMAT', 'MOL', 'MPN', 'MSK', 'MSN', 'MT', 'MuP', 'NO', 'OI', 'PRO', 'SEM', 'SL', 'SOC', 'SUS', 'SY', 'TB', 'TES', 'TL', 'TSL', 'U', 'WNE', 'X', 'XACG', 'XSY', 'Y', 'YDT', 'YH', 'Yi', 'YMP', 'YTHele', 'YTHträ']

exports.search = function(programme, callback) {
  
  // Build the post string from an object
  var data = '-Maxrecords=600&-Operator=equals&kp_programkod='+ programme +'&-Operator=equals'
    +'&kp_institution=&-Operator=equals&kp_termin_ber=&-Operator=equals&kp_period_ber='
    +'&-Op=cn&kp_kurskod=&-Op=cn&kp_kursnamn_en=&-Op=cn&kp_kursinnehall_en=&-Search=Search';

  // An object of options to indicate where to post to
  var options = {
      host: 'kdb-5.liu.se',
      path: '/liu/lith/studiehandboken/search_15/search_response_en.lasso',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data).toString(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Connection': 'keep-alive',
      },
  };

  var htmlStr = "";
  var post_req = http.request(options, function (res){
    res.on('data', function (chunk) {
      htmlStr += chunk
    });
    res.on('end', function(){
      callback(null, extractCourses(htmlStr));
    });
  });

  post_req.write(data);
  
  post_req.end();
};


var assert = require('assert');
var http = require('http');

describe('node',function(){

	describe('#http', function(){
		it('should be able to make an internet request', function(done){
			var url = 'http://www.google.com';
			var htmlStr = '';
			http.get(url, function(res){
				res.on('data', function(chunk){
					htmlStr += chunk;
				});
				res.on('end', function(){
					assert.notEqual(htmlStr, null, 'htmlStr should not be null');
					assert.equal(htmlStr.length > 0, true, 'htmlStr should have content');
					done();
				});
			})
		});
	});
});
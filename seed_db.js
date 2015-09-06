conn = new Mongo();
db = conn.getDB("reviews");

print('Resetting and seeding DB');

db.courses.remove({});
db.reviews.remove({});

var courses = [
	{
		code: "TNM095",
		title: "Artificiell intelligens för immersiva miljöer",
		year: 2015,
		prof: "Pierangelo Dell'Acqua",
		reviews: []
	},
	{
		code: "TDDB84",
		title: "Designmönster",
		year: 2015,
		prof: "Ola Leifler",
		reviews: []
	}
];
db.courses.insert(courses);

db.courses.find().forEach(function (doc){
	print(tojson(doc));
});
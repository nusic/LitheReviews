angular.module('myApp').controller('MainController',[
  '$scope',
  function ($scope){
  	$scope.programsByType = [
	{
		"type": "Civilingenjörsutbildning",
		"programs": [
			{
				"code": "D",
				"name": "datateknik"
			},
			{
				"code": "DPU",
				"name": "design och produktutveckling"
			},
			{
				"code": "EM",
				"name": "energi - miljö - management"
			},
			{
				"code": "I",
				"name": "industriell ekonomi"
			},
			{
				"code": "Ii",
				"name": "industriell ekonomi - internationell"
			},
			{
				"code": "IT",
				"name": "informationsteknologi"
			},
			{
				"code": "KB",
				"name": "kemisk biologi"
			},
			{
				"code": "M",
				"name": "maskinteknik"
			},
			{
				"code": "MED",
				"name": "medicinsk teknik"
			},
			{
				"code": "TB",
				"name": "teknisk biologi"
			},
			{
				"code": "U",
				"name": "mjukvaruteknik"
			},
			{
				"code": "Y",
				"name": "teknisk fysik och elektroteknik"
			},
			{
				"code": "Yi",
				"name": "teknisk fysik och elektroteknik - internationell"
			},
			{
				"code": "ED",
				"name": "elektronikdesign"
			},
			{
				"code": "KTS",
				"name": "kommunikations- och transportsystem/kommunikation, transport och samhälle"
			},
			{
				"code": "MT",
				"name": "medieteknik"
			}
		]
	},
	{
	"type": "Högskoleingenjörsutbildning",
		"programs": [
			{
				"code": "BI",
				"name": "byggnadsteknik"
			},
			{
				"code": "DI",
				"name": "datateknik"
			},
			{
				"code": "EL",
				"name": "elektronik"
			},
			{
				"code": "KA",
				"name": "kemisk analysteknik"
			},
			{
				"code": "MI",
				"name": "maskinteknik"
			}
		]
	},

	{
		"type": "Matematisk-naturvetenkaplig och datavetenskaplig kandidatutbildning",
		"programs": [
			{
				"code": "Bio",
				"name": "biologi"
			},
			{
				"code": "C",
				"name": "datavetenskap"
			},
			{
				"code": "FyN",
				"name": "fysik och nanovetenskap"
			},
			{
				"code": "Kem",
				"name": "kemi - molekylär design"
			},
			{
				"code": "Kebi",
				"name": "kemisk biologi"
			},
			{
				"code": "Mat",
				"name": "matematik"
			}
		]
	},
	/*
	{
		"type": "Carl Malmsten: Design- och hantverksutbildningar",
		"programs": [
			{
				"code": "CM-DE",
				"name": "Möbeldesign"
			},
			{
				"code": "CM-KO",
				"name": "Möbelkonservering"
			},
			{
				"code": "CM-SN",
				"name": "Möbelsnickeri"
			},
			{
				"code": "CM-TA",
				"name": "Möbeltapetsering"
			},
		]
	},
	*/
	{
		"type": "Övriga kandidatprogram",
		"programs": [
			{
				"code": "FL",
				"name": "Flygtrafik och logistik"
			},
			{
				"code": "FTL",
				"name": "Flygtransport och logistik"
			},
			{
				"code": "GDK",
				"name": "Grafisk design och kommunikation"
			},
			{
				"code": "IP",
				"name": "Innovativ programmering"
			},
			{
				"code": "SL",
				"name": "Samhällets logistik"
			}
		]
	},

	{
		"type": "Påbyggnadsutbildning (magister/master)",
		"programs": [
			{
				"code": "ACG",
				"name": "Advanced Computer Graphics"
			},
			{
				"code": "AER",
				"name": "Aeronautical Engineering"
			},
			{
				"code": "BME",
				"name": "Biomedical Engineering"
			},
			{
				"code": "COE",
				"name": "Communication Electronics"
			},
			{
				"code": "COS",
				"name": "Computer Systems"
			},
			{
				"code": "CS",
				"name": "Computer Science"
			},
			{
				"code": "CSY",
				"name": "Communication Systems"
			},
			{
				"code": "DAV",
				"name": "Datavetenskap"
			},
			{
				"code": "ECO",
				"name": "Ecology and the Environment"
			},
			{
				"code": "ELE",
				"name": "Electronics Engineering"
			},
			{
				"code": "ENV",
				"name": "Energy and Environmental Engineering"
			},
			{
				"code": "ETH",
				"name": "Applied Ethology and Animal Biology"
			},
			{
				"code": "IND",
				"name": "Industrial Engineering and Management"
			},
			{
				"code": "KOS",
				"name": "Organic Synthesis/Medicinal Chemistry"
			},
			{
				"code": "MEC",
				"name": "Mechanical Engineering"
			},
			{
				"code": "MFYS",
				"name": "Fysik och nanovetenskap"
			},
			{
				"code": "MMAT",
				"name": "Matematik"
			},
			{
				"code": "MSK",
				"name": "Maskinteknik"
			},
			{
				"code": "MPN",
				"name": "Materials Physics and Nanotechnology"
			},
			{
				"code": "MSN",
				"name": "Materials Science and Nanotechnology"
			},
			{
				"code": "PRO",
				"name": "Protein Sceince"
			},
			{
				"code": "SOC",
				"name": "System-on-Chip"
			},
			{
				"code": "SUS",
				"name": "Sustainability Engineering and Management"
			},
			{
				"code": "TSL",
				"name": "Intelligent Transport Systems and Logistics"
			},
			{
				"code": "WNE",
				"name": "Wireless Networks and Electronics"
			},
		]
	},
	/*
	{
		"type": "Behörighetsgivande utbildning",
		"programs": [
			{
				"code": "ASIENJ, ASIENK",
				"name": "Asienår med inriktning mot Japan resp. Kina"
			},
			{
				"code": "Basår",
				"name": "Tekniskt/naturvetenskapligt basår"
			}
		]
	},


	{
		"type": "Övrigt",
		"programs": [
			{
				"code": "FRIST",
				"name": "Fristående kursubudet"
			}
		]
	}
	*/
]
  }
]);
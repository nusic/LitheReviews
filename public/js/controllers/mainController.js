angular.module('myApp').controller('MainController',[
  '$scope',
  function ($scope){
  	$scope.programsByType = getPrograms();
  }
]);


function getPrograms(){
	return [
  {
    "type": "Civilingenjörsutbildningar",
    "programs": [
      {
        "code": "D",
        "name": "Datateknik"
      },
      {
        "code": "DPU",
        "name": "Design och produktutveckling"
      },
      {
        "code": "EM",
        "name": "Energi - miljö - management"
      },
      {
        "code": "I",
        "name": "Industriell ekonomi"
      },
      {
        "code": "Ii",
        "name": "Industriell ekonomi - internationell"
      },
      {
        "code": "IT",
        "name": "Informationsteknologi"
      },
      {
        "code": "KB",
        "name": "Kemisk biologi"
      },
      {
        "code": "M",
        "name": "Maskinteknik"
      },
      {
        "code": "MED",
        "name": "Medicinsk teknik"
      },
      {
        "code": "TB",
        "name": "Teknisk biologi"
      },
      {
        "code": "U",
        "name": "Mjukvaruteknik"
      },
      {
        "code": "Y",
        "name": "Teknisk fysik och elektroteknik"
      },
      {
        "code": "Yi",
        "name": "Teknisk fysik och elektroteknik - internationell"
      },
      {
        "code": "ED",
        "name": "Elektronikdesign"
      },
      {
        "code": "KTS",
        "name": "Kommunikations- och transportsystem/kommunikation, transport och samhälle"
      },
      {
        "code": "MT",
        "name": "Medieteknik"
      }
    ]
  },
  {
    "type": "Matematiska, naturvetenkapliga och datavetenskapliga kandidatutbildningar",
    "programs": [
      {
        "code": "Bio",
        "name": "Biologi"
      },
      {
        "code": "C",
        "name": "Datavetenskap"
      },
      {
        "code": "FyN",
        "name": "Fysik och nanovetenskap"
      },
      {
        "code": "Kem",
        "name": "Kemi - molekylär design"
      },
      {
        "code": "Kebi",
        "name": "Kemisk biologi"
      },
      {
        "code": "Mat",
        "name": "Matematik"
      }
    ]
  },
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
    "type": "Påbyggnadsutbildningar (magister/master)",
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
      }
    ]
  }
];
	
		/*
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
		*/
		
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
}




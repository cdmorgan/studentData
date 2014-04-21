var colorrange = [];
var state = null, chartState = 0, chart2State = 0, chart1Data, chart2Data;
var schools = {
	"asheville" : "UNC Asheville",
	"ch" : "UNC Chapel Hill",
	"charlotte" : "UNC Charlotte",
	"greensboro" : "UNC Greensboro",
	"pembroke" : "UNC Pembroke",
	"wilmington" : "UNC Wilmington",
	"arts" : "UNC School of the Arts",
	"wcu" : "Western Carolina University",
	"wssu" : "Winston-Salem State University",
	"ncsu" : "NC State University",
	"nccu" : "North Carolina Central University",
	"ncat" : "NC A&T State University",
	"fsu" : "Fayetteville State University",
	"ecsu" : "Elizabeth City State University",
	"ecu" : "East Carolina University",
	"asu" : "Appalachian State University",
	"avg" : "All Institutions (Avg.)"
};

function chart(e, chartNum, c1State, c2State) {
	var target = $(e.currentTarget).attr("id");
	state = (target === "yearBtn" || target === "schoolBtn") ? 0 : (target === "yearBtn2" || target === "schoolBtn2") ? 1 : 2;
	chartState = (target === "yearBtn" || target === "yearBtn2") ? 1 : (target === "schoolBtn" || target === "schoolBtn2") ? 2 : c1State;
	chart2State = (target === "yearBtn" || target === "schoolBtn") ? 0 : (target === "yearBtn2") ? 1 : (target === "schoolBtn2") ? 2 : c2State;
	var fullLength = (chartState === chart2State) ? true : false;
	
	(state === 2) ? emptyOne() : emptyBoth();

	function emptyOne() {
		var chartTitle = (chartNum + "Title");
		$(chartNum).empty();
		$(chartTitle).empty();
	}

	function emptyBoth() {
		$(".chart, .chart2, .chartTitle, .chart2Title").empty();
	}


	$(".title").empty();

	var dataSet = document.getElementById('dataSet');
	dataSet = dataSet.options[dataSet.selectedIndex].value;

	var dataSet2 = document.getElementById('dataSet2');
	dataSet2 = dataSet2.options[dataSet2.selectedIndex].value;

	var school = document.getElementById('selectSchool');
	school = school.options[school.selectedIndex].value;

	var school2 = document.getElementById('selectSchool2');
	school2 = school2.options[school2.selectedIndex].value;

	var year = document.getElementById('selectYear');
	year = year.options[year.selectedIndex].value;

	var year2 = document.getElementById('selectYear2');
	year2 = year2.options[year2.selectedIndex].value;

	(chartState !== 0 && chart2State !== 0) ? checkBoth() : checkOne();

	function checkOne() {
		(dataSet === "default") ? alert("Choose a Data Set") : (chartState === 1 && year === "default") ? alert("Choose a year to visualize") : (chartState === 2 && school === "default") ? alert("Choose a school to visualize") : loadCSV();
	}

	function checkBoth() {
		(dataSet === "default" || dataSet2 === "default") ? alert("Choose two Data Sets") : (chartState === 1 && (year === "default" || year2 === "default") && state !== 2) ? alert("Choose two years to compare") : (chartState === 2 && (school === "default" || school2 === "default") && state !== 2) ? alert("Choose two schools to compare") : loadCSV();
	}

	function loadCSV() {

		var csvpath, currentData, title, titleOne, titleTwo;

		var data = document.getElementById('dataSet');

		var data2 = document.getElementById('dataSet2');

		var schoolOne = document.getElementById('selectSchool');

		var schoolTwo = document.getElementById('selectSchool2');

		var yr = document.getElementById('selectYear');

		var yr2 = document.getElementById('selectYear2');

		function getData() {
			data = data.options[data.selectedIndex].text;
			data2 = data2.options[data2.selectedIndex].text;
			schoolOne = schoolOne.options[schoolOne.selectedIndex].text;
			schoolTwo = schoolTwo.options[schoolTwo.selectedIndex].text;
			yr = yr.options[yr.selectedIndex].text;
			yr2 = yr2.options[yr2.selectedIndex].text;
		}


		(state === 0 || state === 2) ? loadOne() : loadTwo();

		function loadOne() {
			(state === 2) ? reload() : firstLoad();

			function firstLoad() {
				csvpath = ("./data/" + dataSet + ".csv");
				currentData = document.getElementById('dataSet');
				currentData = currentData.options[currentData.selectedIndex].text;
				title = (chartState === 1) ? year : schools[school];
				$('.title').html("Comparing " + currentData + " for " + title);
			}

			function reload() {
				getData();
				csvpath = (chartNum === ".chart") ? ("./data/" + dataSet + ".csv") : ("./data/" + dataSet2 + ".csv");

				(chartState === 0 || chart2State === 0) ? setOneData() : setTwoData();

				function setOneData() {
					currentData = (chartNum === ".chart") ? checkChartOne() : checkChartTwo();

					function checkChartOne() {
						return (chartState === 1) ? yr : schoolOne;
					}

					function checkChartTwo() {
						return (chart2State === 1) ? yr2 : schoolTwo;
					}

					var thisData = (chartNum === ".chart") ? data : data2;
					$('.title').html("Comparing " + thisData + " for " + currentData);

				}

				function setTwoData() {
					var currentData;
					(data === data2) ? setSameData() : setDiffData();

					function setSameData() {
						currentData = (chartState === 1 && chart2State === 1 && yr === yr2) ? yr : (chartState === 1 && chart2State === 1 && yr !== yr2) ? (yr + " & " + yr2) : (chartState === 1 && chart2State === 2) ? (yr + " & " + schoolTwo) : (chartState === 2 && chart2State === 1) ? (schoolOne + " & " + yr2) : (chartState === 2 && chart2State === 2 && schoolOne === schoolTwo) ? schoolOne : (schoolOne + " & " + schoolTwo);
						titleOne = (chartState === 1) ? yr : schoolOne;
						titleTwo = (chart2State === 1) ? yr2 : schoolTwo;
						$('.title').html("Comparing " + data + " for " + currentData);
						$('.chartTitle').html(titleOne);
						$('.chart2Title').html(titleTwo);
					}

					function setDiffData() {
						currentData = (chartState === 1 && chart2State === 1 && yr === yr2) ? (data + " & " + data2 + " for " + yr) : (chartState === 1 && chart2State === 1 && yr !== yr2) ? (data + " for " + yr + " and " + data2 + " for " + yr2) : (chartState === 1 && chart2State === 2) ? (data + " for " + yr + " & " + data2 + " for " + schoolTwo) : (chartState === 2 && chart2State === 1) ? (data + " for " + schoolOne + "  & " + data2 + " for " + yr2) : (chartState === 2 && chart2State === 2 && schoolOne === schoolTwo) ? (data + " & " + data2 + " for " + schoolOne) : (data + " for " + schoolOne + " & " + data2 + " for " + schoolTwo);
						titleOne = (chartState === 1) ? yr : schoolOne;
						titleTwo = (chart2State === 1) ? yr2 : schoolTwo;
						$('.title').html("Comparing " + currentData);
						if (chartState === chart2State) {
							if ((chartState === 1 && yr === yr2) || (chartState === 2 && schoolOne === schoolTwo)) {
								$('.chartTitle').html(data);
								$('.chart2Title').html(data2);
							} else {
								$('.chartTitle').html(data + " for " + titleOne);
								$('.chart2Title').html(data2 + " for " + titleTwo);
							}
						} else {
							$('.chartTitle').html(data + " for " + titleOne);
							$('.chart2Title').html(data2 + " for " + titleTwo);
						}

					}

				}

			}

			loadVis(chartNum);
		}

		function loadTwo() {

			getData();

			(dataSet === dataSet2) ? setOneData() : setTwoData();

			function setOneData() {
				var currentData = (chartState === 1 && chart2State === 1 && yr === yr2) ? yr : (chartState === 1 && chart2State === 1 && yr !== yr2) ? (yr + " & " + yr2) : (chartState === 2 && chart2State === 2 && schoolOne === schoolTwo) ? schoolOne : (schoolOne + " & " + schoolTwo);
				titleOne = (chartState === 1) ? yr : schoolOne;
				titleTwo = (chart2State === 1) ? yr2 : schoolTwo;
				$('.title').html("Comparing " + data + " for " + currentData);
				$('.chartTitle').html(titleOne);
				$('.chart2Title').html(titleTwo);
			}

			function setTwoData() {
				var currentData = (chartState === 1 && chart2State === 1 && yr === yr2) ? (data + " & " + data2 + " for " + yr) : (chartState === 1 && chart2State === 1 && yr !== yr2) ? (data + " for " + yr + " & " + data2 + " for " + yr2) : (chartState === 2 && chart2State === 2 && schoolOne === schoolTwo) ? (data + " & " + data2 + " for " + schoolOne) : (data + " for " + schoolOne + " & " + data2 + " for " + schoolTwo);
				titleOne = (chartState === 1) ? yr : schoolOne;
				titleTwo = (chart2State === 1) ? yr2 : schoolTwo;
				$('.title').html("Comparing " + currentData);
				if (chartState === chart2State) {
					if ((chartState === 1 && yr === yr2) || (chartState == 2 && schoolOne === schoolTwo)) {
						$('.chartTitle').html(data);
						$('.chart2Title').html(data2);
					} else {
						$('.chartTitle').html(data + " for " + titleOne);
						$('.chart2Title').html(data2 + " for " + titleTwo);
					}
				} else {
					$('.chartTitle').html(data + " for " + titleOne);
					$('.chart2Title').html(data2 + " for " + titleTwo);
				}

			}

			function loadChartOne() {
				csvpath = ("./data/" + dataSet + ".csv");
				loadVis('.chart');
			}

			function loadChartTwo() {
				csvpath = ("./data/" + dataSet2 + ".csv");
				loadVis('.chart2');
			}

			loadChartOne();
			loadChartTwo();
		}

		function loadVis(thisChart) {

			var thisChartState = (thisChart === ".chart") ? chartState : chart2State;

			colorrange = ["#D7191C", "#FDAE61", "#FFFFBF", "#ABD9E9", "#2C7BB6", "#A6611A", "#DFC27D", "#F5F5F5", "#BABABA", "#404040", "#80CDC1", "#018571", "#4DAC26", "#B8E186", "#7B3294", "#C2A5CF", "#D01C8B", "#F1B6DA"];

			strokecolor = colorrange[0];

			var margin = {
				top : 20,
				right : 40,
				bottom : 30,
				left : 30
			};

			var width = document.body.clientWidth - margin.left - margin.right;
			var height = 400 - margin.top - margin.bottom;
			var tooltip = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "20").style("visibility", "hidden").style("top", "115px").style("left", "55px");
			var tooltip2 = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "20").style("visibility", "hidden").style("top", "115px").style("left", "55px");

			var x = d3.scale.linear().range([0, width]);

			var y = d3.scale.linear().range([height - 10, 0]);

			var z = d3.scale.ordinal().range(colorrange);

			var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);

			var yAxis = d3.svg.axis().scale(y);

			var yAxisr = d3.svg.axis().scale(y);

			var stack = d3.layout.stack().offset("silhouette").values(function(d) {
				return d.values;
			}).x(function(d) {
				return d.year + 1;
			}).y(function(d) {
				return d.value;
			});

			//this is how d3 groups the categories
			var nest = d3.nest().key(function(d) {
				return (thisChartState === 1) ? d.key : d.date;
			});

			var area = d3.svg.area().interpolate("cardinal").x(function(d) {
				return x(d.year + 1);
			}).y0(function(d) {
				return y(d.y0);
			}).y1(function(d) {
				return y(d.y0 + d.y);
			});

			var svg = d3.select(thisChart).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var graph = d3.csv(csvpath, function(thisData) {
				var data = [];
				var thisChartYear = (thisChart === ".chart") ? year : year2;
				var thisChartSchool = (thisChart === ".chart") ? school : school2;
				(thisChartState === 1) ? byYear(thisData) : bySchool(thisData);

				function byYear(d) {
					d.forEach(function(d) {
						if (d.date === thisChartYear) {
							data.push(d);
						}
					});
					if (thisChart === ".chart")
						chart1Data = data;
					else
						chart2Data = data;
				}

				function bySchool(d) {
					d.forEach(function(d) {
						if (d.key === thisChartSchool) {
							data.push(d);
						}
					});
					if (thisChart === ".chart")
						chart1Data = data;
					else
						chart2Data = data;
				}


				data.forEach(function(d) {
					d.year = +d.year;
					d.value = +d.value;
					d.date = +d.date;
				});

				var layers = stack(nest.entries(data));

				x.domain(d3.extent(data, function(d) {
					return d.year + 1;
				}));
				y.domain([0, d3.max(data, function(d) {
					return d.y0 + d.y;
				})]);

				svg.selectAll(".layer").data(layers).enter().append("path").attr("class", "layer").attr("d", function(d) {
					return area(d.values);
				}).style("fill", function(d, i) {
					return z(i);
				});

				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

				svg.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ", 0)").call(yAxis.orient("right"));

				svg.append("g").attr("class", "y axis").call(yAxis.orient("left"));

				svg.selectAll(".layer").attr("opacity", 1).on("mouseover", function(d, i) {
					svg.selectAll(".layer").transition().duration(250).attr("opacity", function(d, j) {
						return j !== i ? 0.6 : 1;
					});
				}).on("mousemove", function(d, i) {
					var xPos, xPos2, yPos, pro, pro2, tense, tense2, colorKey, colorKey2, yearKey, yearKey2, test, text2;
					mousex = d3.mouse(this);
					var invertedx = x.invert(mousex[0]);
					invertedx = Math.round(invertedx);
					var width = document.width / 2;
					fullLength = (chartState === chart2State) ? true : false;
					
					if (fullLength) {
						var val1 = [], val2 = [];
						yPos = (mousex[0] > width) ? ((mousex[0] - 250) + "px") : ((mousex[0] + 100) + "px");
						$.each(chart1Data, function() {
							if ((chartState == 1 && this.key === d.key) || (chartState === 2 && this.date == d.key)) {
								val1.push(this);
							}
						});
						var chart1D = {
							key : d.key,
							values : val1
						};

						xPos = (mousex[1] < 50) ? 50 : ((mousex[1] + 100) + "px");
						pro = chart1D.values[invertedx - 1].value;
						tense = (invertedx > 1) ? " years" : " year";
						colorKey = (chartState === 1) ? d.key : chart1D.values[invertedx - 1].key;
						yearKey = (chartState === 1) ? chart1D.values[invertedx].date : d.key;
						action = (dataSet === "grads") ? "Graduated" : (dataSet === "retn") ? "Retained" : "Persisted";
						text = "<p>" + schools[colorKey] + "<br /><br />Year of Entry: " + yearKey + "<br /><br />" + pro + "% " + action + " after " + invertedx + tense + "</p>";

						$.each(chart2Data, function() {
							if ((chart2State == 1 && this.key === d.key) || (chart2State === 2 && this.date == d.key)) {
								val2.push(this);
							}
						});
						var chart2D = {
							key : d.key,
							values : val2
						};

						xPos2 = (mousex[1] < 50) ? 50 : ((mousex[1] + 525) + "px");
						pro2 = chart2D.values[invertedx - 1].value;
						tense2 = (invertedx > 1) ? " years" : " year";
						colorKey2 = (chart2State === 1) ? d.key : chart2D.values[invertedx - 1].key;
						yearKey2 = (chart2State === 1) ? chart2D.values[invertedx].date : d.key;
						action2 = (dataSet2 === "grads") ? "Graduated" : (dataSet2 === "retn") ? "Retained" : "Persisted";
						text2 = "<p>" + schools[colorKey2] + "<br /><br />Year of Entry: " + yearKey2 + "<br /><br />" + pro2 + "% " + action2 + " after " + invertedx + tense2 + "</p>";

						d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos), tooltip2.html(text2).style("visibility", "visible").style("top", xPos2).style("left", yPos);
					} else {
						xPos = (mousex[1] < 50) ? 50 : (thisChart === ".chart") ? ((mousex[1] + 100) + "px") : ((mousex[1] + 525) + "px");
						yPos = (mousex[0] > width) ? ((mousex[0] - 200) + "px") : ((mousex[0] + 100) + "px");
						pro = d.values[invertedx - 1].value;
						tense = (invertedx > 1) ? " years" : " year";
						colorKey = (thisChartState === 1) ? d.key : d.values[invertedx - 1].key;
						yearKey = (thisChartState === 1) ? d.values[invertedx].date : d.key;
						thisDataSet = (thisChart === ".chart") ? dataSet : dataSet2;
						action = (thisDataSet === "grads") ? "Graduated" : (thisDataSet === "retn") ? "Retained" : "Persisted";
						text = "<p>" + schools[colorKey] + "<br /><br />Year of Entry: " + yearKey + "<br /><br />" + pro + "% " + action + " after " + invertedx + tense + "</p>";

						d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos);
					}
				}).on("mouseout", function(d, i) {
					svg.selectAll(".layer").transition().duration(250).attr("opacity", "1");
					d3.select(this).classed("hover", false).attr("stroke-width", "0px"), tooltip.html("<p>" + d.key + "<br>" + pro + "</p>").style("visibility", "hidden"), tooltip2.html("<p>" + d.key + "<br>" + pro + "</p>").style("visibility", "hidden");
				}).on("click", function(d, i) {
					var dropDown, key = d.key;
					thisChart = ("." + $(this).parents("div").attr("class"));

					(thisChart === ".chart") ? checkChart() : checkChartTwo();

					function checkChart() {
						dropDown = (thisChartState === 1) ? document.getElementById('selectSchool') : document.getElementById('selectYear');
						if (thisChartState === 1) {
							$('#selectYear>option:eq(0)').prop('selected', true);
						} else {
							$('#selectSchool>option:eq(0)').prop('selected', true);
						}
						chartState = (chartState === 1) ? 2 : 1;
					}

					function checkChartTwo() {
						dropDown = (thisChartState === 1) ? document.getElementById('selectSchool2') : document.getElementById('selectYear2');
						if (thisChartState === 1) {
							$('#selectYear2>option:eq(0)').prop('selected', true);
						} else {
							$('#selectSchool2>option:eq(0)').prop('selected', true);
						}
						chart2State = (chart2State === 1) ? 2 : 1;
					}


					$.each(dropDown, function(d) {
						if ($(dropDown).children()[d].value === key) {
							$(dropDown).children()[d].selected = true;
						}
					});

					chart(event, thisChart, chartState, chart2State);
				});

				var vertical = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "19").style("width", "1px").style("height", "380px").style("top", "100px").style("bottom", "150px").style("left", "0px").style("background", "#fff");
				var top, h;
				fullLength = (chartState === chart2State) ? true : false;

				if (fullLength) {
					top = 150;
					h = 825;
				} else {
					top = (thisChart === ".chart") ? 150 : 595;
					h = 380;
				}

				d3.select(thisChart).on("mousemove", function() {
					mousex = d3.mouse(this);
					mousex = mousex[0] + 5;
					vertical.style("left", mousex + "px").style("height", h + "px").style("top", top + "px").style("bottom", (top + 50) + "px");
				}).on("mouseover", function() {
					mousex = d3.mouse(this);
					mousex = mousex[0] + 5;
					vertical.style("left", mousex + "px").style("height", h + "px").style("top", top + "px").style("bottom", (top + 50) + "px");
				}).on("mouseout", function() {
					vertical.style("left", "0px");
				});
			});
		}
	}
}

var colorrange = [], chart1Data, chart2Data, chart3Data;
var state = null, chartState = 0, chart2State = 0, chart3State = 0;
var entities = {
	"cci" : "College of Computing & Informatics",
	"cs" : "Computer Science",
	"sis" : "Software & Information Systems"
};

function chart(e, chartNum, thisState, c1State, c2State) {
	var target = $(e.currentTarget).attr("id");

	var dataSet = document.getElementById('dataSet');
	var dataSetVal = dataSet.options[dataSet.selectedIndex].value;
	var dataSetText = dataSet.options[dataSet.selectedIndex].text;

	var dataSet2 = document.getElementById('dataSet2');
	var dataSet2Val = dataSet2.options[dataSet2.selectedIndex].value;
	var dataSet2Text = dataSet2.options[dataSet2.selectedIndex].text;

	var entity = document.getElementById('selectEntity');
	var entityVal = entity.options[entity.selectedIndex].value;
	var entityText = entity.options[entity.selectedIndex].text;

	var entity2 = document.getElementById('selectEntity2');
	var entity2Val = entity2.options[entity2.selectedIndex].value;
	var entity2Text = entity2.options[entity2.selectedIndex].text;

	state = (target === "yearBtn" || target === "entityBtn") ? 0 : (target === "yearBtn2" || target === "entityBtn2") ? 1 : thisState;
	chartState = ((dataSetVal !== dataSet2Val) && (entityVal === "cci" && entity2Val === "cci")) ? 0 : (target === "yearBtn" || target === "yearBtn2") ? 1 : (target === "entityBtn" || target === "entityBtn2") ? 2 : (chartState === 0) ? 0 : c1State;
	chart2State = (target === "yearBtn" || target === "entityBtn") ? 0 : (target === "yearBtn2") ? 1 : (target === "entityBtn2") ? 2 : (chart2State === 0) ? 0 : c2State;
	chart3State = (target === "entityBtn2" && dataSetVal !== dataSet2Val && entityVal === entity2Val) ? 2 : 0;

	function emptyOne() {
		var chartTitle = (chartNum + "Title");
		$(chartNum).empty();
		$(chartTitle).empty();
	}

	function emptyBoth() {
		$(".chart, .chart2, .chart3, .chartTitle, .chart2Title, .chart3Title").empty();
	}

	(state === 2 || state === 3) ? emptyOne() : emptyBoth();

	$(".title").empty();

	function checkOne() {
		(dataSetVal === "default") ? alert("Choose a Data Set") : /*(chartState === 1 && year === "default") ? alert("Choose a year to visualize") :*/(chartState === 2 && entityVal === "default") ? alert("Choose an entity to visualize") : loadCSV();
	}

	function checkBoth() {
		(dataSetVal === "default" || dataSet2Val === "default") ? alert("Choose two Data Sets") : /*(chartState === 1 && (year === "default" || year2 === "default") && state !== 2) ? alert("Choose two years to compare") :*/(chartState === 2 && (entityVal === "default" || entity2Val === "default") && state !== 2) ? alert("Choose two entities to compare") : loadCSV();
	}

	(chartState !== 0 && chart2State !== 0) ? checkBoth() : checkOne();

	function loadCSV() {
		var csvpath, currentData, title, thisTitle;
		var dataPath = (dataSetVal === "grads" && entityVal === "cci") ? "cciGrads" : (dataSetVal === "retn" && entityVal === "cci") ? "cciRetn" : (dataSetVal === "grads" && entityVal === "cs") ? "csGrads" : (dataSetVal === "retn" && entityVal === "cs") ? "csRetn" : (dataSetVal === "grads" && entityVal === "sis") ? "sisGrads" : "sisRetn";
		var firstEntity = entities[entityVal];

		if (chart2State !== 0) {
			var dataPath2 = (dataSet2Val === "grads" && entity2Val === "cci") ? "cciGrads" : (dataSet2Val === "retn" && entity2Val === "cci") ? "cciRetn" : (dataSet2Val === "grads" && entity2Val === "cs") ? "csGrads" : (dataSet2Val === "retn" && entity2Val === "cs") ? "csRetn" : (dataSet2Val === "grads" && entity2Val === "sis") ? "sisGrads" : "sisRetn";
			var secondEntity = entities[entity2Val];
		}

		function loadOne() {
			function firstLoad() {
				csvpath = ("./data/" + dataPath + ".csv");
				$('.title').html("Comparing " + dataSetText + " for " + firstEntity);
			}

			function reload() {
				csvpath = (chartNum === ".chart") ? ("./data/" + dataPath + ".csv") : ("./data/" + dataPath2 + ".csv");

				function setOneData() {
					currentData = (chartNum === ".chart") ? firstEntity : secondEntity;
					var thisData = (chartNum === ".chart") ? dataSetText : dataSet2Text;
					$('.title').html("Comparing " + thisData + " for " + currentData);
				}

				function setTwoData() {

					function setSameData() {
						currentData = (chartState === 2 && chart2State === 2 && entityOne === entityTwo) ? firstEntity : (firstEntity + " & " + secondEntity);
						$('.title').html("Comparing " + dataSetText + " for " + currentData);
					}

					function setDiffData() {
						currentData = (chartState === 2 && chart2State === 2 && entityVal === entityVal) ? (dataSetText + " & " + dataSet2Text + " for " + firstEntity) : (dataSetText + " for " + firstEntity + " & " + dataSet2Text + " for " + secondEntity);
						$('.title').html("Comparing " + currentData);
					}

					(dataSetVal === dataSet2Val) ? setSameData() : setDiffData();
				}

				(chartState === 0 || chart2State === 0) ? setOneData() : setTwoData();
			}

			(state === 2 || state === 3) ? reload() : firstLoad();

			loadVis(chartNum);
		}

		function loadTwo() {
			var thisPathOne, thisPathTwo, thisPathThree;

			function loadChartOne(d) {
				csvpath = ("./data/" + d + ".csv");
				loadVis('.chart');
			}

			function loadChartTwo(d) {
				csvpath = ("./data/" + d + ".csv");
				loadVis('.chart2');
			}

			function loadChartThree(d) {
				csvpath = ("./data/" + d + ".csv");
				loadVis('.chart3');
			}

			function setOneData() {
				var currentData = (chartState === 2 && chart2State === 2 && entityVal === entity2Val) ? firstEntity : (firstEntity + " & " + secondEntity);
				$('.title').html("Comparing " + dataSetText + " for " + currentData);
				$('.chartTitle').html(entities[entityVal]);
				$('.chart2Title').html(entities[entity2Val]);
				loadChartOne(dataPath);
				loadChartTwo(dataPath2);
			}

			function setTwoData() {
				var currentData = (chartState === 2 && chart2State === 2 && entityVal === entity2Val) ? (dataSetText + " & " + dataSet2Text + " for " + firstEntity) : (dataSetText + " for " + firstEntity + " & " + dataSet2Text + " for " + secondEntity);
				$('.title').html("Comparing " + currentData);
				$('.chartTitle').html(entities[entityVal] + "'s " + dataSetText);
				$('.chart2Title').html(entities[entity2Val] + "'s " + dataSet2Text);
				loadChartOne(dataPath);
				loadChartTwo(dataPath2);
			}

			function setThreeData() {
				var currentData = (chartState === 2 && chart2State === 2 && entityVal === entity2Val) ? (dataSetText + " & " + dataSet2Text + " for " + firstEntity) : (dataSetText + " for " + firstEntity + " & " + dataSet2Text + " for " + secondEntity);
				$('.title').html("Comparing " + currentData);
				$('.chart2Title').html("In College");
				$('.chart3Title').html("In University");
				if (entity2Val === "cs" || entity2Val === "sis") {
					$('.chartTitle').html("In Major");
					thisPathOne = (entity2Val + "InMajor");
					loadChartOne(thisPathOne);
					thisPathTwo = (entity2Val + "InCollege");
					loadChartTwo(thisPathTwo);
					thisPathThree = (entity2Val + "InUniversity");
					loadChartThree(thisPathThree);
				} else {
					thisPathTwo = (entity2Val + "InCollege");
					loadChartTwo(thisPathTwo);
					thisPathThree = (entity2Val + "InUniversity");
					loadChartThree(thisPathThree);
				}

			}

			(dataSetVal === dataSet2Val) ? setOneData() : (entityVal === entity2Val) ? setThreeData() : setTwoData();
		}


		(state === 0 || state === 2 || state === 3) ? loadOne() : loadTwo();

		function loadVis(thisChart) {

			var thisChartState = (thisChart === ".chart") ? chartState : (thisChart === ".chart2") ? chart2State : chart3State;

			colorrange = ["#008837", "#A6DBA0", "#FFFFBF", "#D7191C", "#2C7BB6", "#ABD9E9", "#FDAE61"];

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
			var tooltip3 = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "20").style("visibility", "hidden").style("top", "115px").style("left", "55px");

			var x = d3.scale.linear().range([0, width]);

			var y = d3.scale.linear().range([height - 10, 0]);

			var z = d3.scale.ordinal().range(colorrange);

			var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);

			var yAxis = d3.svg.axis().scale(y);

			var yAxisr = d3.svg.axis().scale(y);

			var stack = d3.layout.stack().offset("silhouette").values(function(d) {
				return d.values;
			}).x(function(d) {
				return d.year;
			}).y(function(d) {
				return ((d.value / d.incoming) === Infinity) ? 0 : (d.value / d.incoming) * 100;
			});

			//this is how d3 groups the categories
			var nest = d3.nest().key(function(d) {
				return d.key;
			});

			var area = d3.svg.area().interpolate("cardinal").x(function(d) {
				return x(d.year);
			}).y0(function(d) {
				return (d.incoming === 0 && d.value === 0) ? y(10) : y(d.y0);
			}).y1(function(d) {
				return (d.incoming === 0 && d.value === 0) ? y(10) : y(d.y0 + d.y);
			});

			var svg = d3.select(thisChart).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var graph = d3.csv(csvpath, function(thisData) {
				var data = [];
				if (thisChart === ".chart")
					chart1Data = thisData;
				else if (thisChart === ".chart2")
					chart2Data = thisData;
				else
					chart3Data = thisData;

				(thisChartState === 1) ? byYear(thisData) : byEntity(thisData);

				function byEntity(d) {
					for (var i = 0; i < 13; i++) {
						obj1 = {
							incoming : d[i].incoming,
							key : d[i].key,
							value : d[i].value,
							y : d[i].y,
							y0 : d[i].y0,
							year : d[i].year
						};

						obj2 = {
							incoming : d[i + 13].incoming,
							key : d[i + 13].key,
							value : (chart3State === 0) ? (d[i + 13].value - d[i].value) : d[i + 13].value,
							y : d[i + 13].y,
							y0 : d[i + 13].y0,
							year : d[i + 13].year
						};

						if (d.length === 39) {
							obj3 = {
								incoming : d[i + 26].incoming,
								key : d[i + 26].key,
								value : (chart3State === 0) ? d[i + 26].value - d[i + 13].value : d[i + 26].value,
								y : d[i + 26].y,
								y0 : d[i + 26].y0,
								year : d[i + 26].year
							};
						}
						data[i] = obj1;
						data[i + 13] = obj2;
						if (d.length === 39)
							data[i + 26] = obj3;
					}
				}


				data.forEach(function(d) {
					d.year = +d.year;
					d.value = +d.value;
					d.incoming = +d.incoming;
				});

				var layers = stack(nest.entries(data));

				x.domain(d3.extent(data, function(d) {
					return d.year;
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
					var pro, pro2, pro3, incoming, incoming2, incoming3, didWhat, didWhat2, didWhat3, where, where2, where3, text, text2, text3, howMany, howMany2, howMany3, xPos, xPos2, xPos3, yPos, entityKey, val1 = [], val2 = [], val3 = [];
					var format = d3.format('.4p');
					mousex = d3.mouse(this);
					var invertedx = x.invert(mousex[0]);
					invertedx = Math.round(invertedx);

					if (chartState !== 0) {
						$.each(chart1Data, function() {
							if (this.key === d.key) {
								val1.push(this);
							}
						});
						var chart1D = {
							key : d.key,
							values : val1
						};
						$.each(chart1D.values, function() {
							if (this.year == invertedx) {
								pro = (isNaN(this.value / this.incoming)) ? format(0) : format(this.value / this.incoming);
								incoming = this.incoming;
								howMany = this.value;
								didWhat = (d.key === "grads") ? "Graduated" : "Retained";
							}
						});
					} else
						chart1D = null;

					if (chart2State !== 0) {
						$.each(chart2Data, function() {
							if (this.key === d.key) {
								val2.push(this);
							}
						});
						var chart2D = {
							key : d.key,
							values : val2
						};
						$.each(chart2D.values, function() {
							if (this.year == invertedx) {
								pro2 = (isNaN(this.value / this.incoming)) ? format(0) : format(this.value / this.incoming);
								incoming2 = this.incoming;
								howMany2 = this.value;
								didWhat2 = (d.key === "grads") ? "Graduated" : "Retained";
							}
						});
					} else
						chart2D = null;

					if (chart3State !== 0) {
						$.each(chart3Data, function() {
							if (this.key === d.key) {
								val3.push(this);
							}
						});
						var chart3D = {
							key : d.key,
							values : val3
						};
						$.each(chart3D.values, function() {
							if (this.year == invertedx) {
								pro3 = (isNaN(this.value / this.incoming)) ? format(0) : format(this.value / this.incoming);
								incoming3 = this.incoming;
								howMany3 = this.value;
								didWhat3 = (d.key === "grads") ? "Graduated" : "Retained";
							}
						});
					} else
						chart3D = null;

					var width = document.width / 2;

					if (chart1D && !chart2D) {
						xPos = (mousex[1] < 50) ? 50 : ((mousex[1] + 100) + "px");
						yPos = (mousex[0] > width) ? ((mousex[0] - 250) + "px") : ((mousex[0] + 100) + "px");
						var action = (dataSetVal === "grads") ? "Graduated" : (dataSetVal === "retn") ? "Retained" : "Persisted";
						text = "<p>" + entities[entityVal] + "<br /><br />Incoming freshmen for " + invertedx + " -  " + incoming + "<br /><br />" + pro + " (" + howMany + ") " + action + " with" + d.key + "</p>";
						d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos);
					} else if (chart1D && !chart3D) {
						xPos = (mousex[1] < 50) ? 50 : ((mousex[1] + 100) + "px");
						xPos2 = (mousex[1] < 50) ? 50 : ((mousex[1] + 550) + "px");
						yPos = (mousex[0] > width) ? ((mousex[0] - 250) + "px") : ((mousex[0] + 100) + "px");
						var action = (dataSetVal === "grads") ? "Graduated" : (dataSetVal === "retn") ? "Retained" : "Persisted";
						var action2 = (dataSet2Val === "grads") ? "Graduated" : (dataSet2Val === "retn") ? "Retained" : "Persisted";
						text = "<p>" + entities[entityVal] + "<br /><br />Incoming freshmen for " + invertedx + " -  " + incoming + "<br /><br />" + pro + " (" + howMany + ") " + action + " with" + d.key + "</p>";
						text2 = "<p>" + entities[entity2Val] + "<br /><br />Incoming freshmen for " + invertedx + " -  " + incoming2 + "<br /><br />" + pro2 + " (" + howMany2 + ") " + action2 + " with" + d.key + "</p>";
						if (pro === undefined) {
							d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip2.html(text2).style("visibility", "visible").style("top", xPos2).style("left", yPos);
						} else if (pro2 === undefined) {
							d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos);
						} else {
							d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos), tooltip2.html(text2).style("visibility", "visible").style("top", xPos2).style("left", yPos);							
						}
						
					} else if (!chart1D && chart3D) {
						xPos = (mousex[1] < 50) ? 50 : ((mousex[1] + 150) + "px");
						xPos2 = (mousex[1] < 50) ? 50 : ((mousex[1] + 600) + "px");
						yPos = (mousex[0] > width) ? ((mousex[0] - 250) + "px") : ((mousex[0] + 100) + "px");
						var action = (dataSetVal === "grads") ? "Graduated" : (dataSetVal === "retn") ? "Retained" : "Persisted";
						var action2 = (dataSet2Val === "grads") ? "Graduated" : (dataSet2Val === "retn") ? "Retained" : "Persisted";
						where = "within College";
						where2 = "within University";
						text = "<p>" + entities[entityVal] + "<br /><br />Incoming freshmen for " + invertedx + " -  " + incoming2 + "<br /><br />" + pro2 + " (" + howMany2 + ") " + action + " " + where + "</p>";
						text2 = "<p>" + entities[entity2Val] + "<br /><br />Incoming freshmen for " + invertedx + " -  " + incoming3 + "<br /><br />" + pro3 + " (" + howMany3 + ") " + action2 + " " + where2 + "</p>";
						d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos), tooltip2.html(text2).style("visibility", "visible").style("top", xPos2).style("left", yPos);
					} else {
						xPos = (mousex[1] < 50) ? 50 : ((mousex[1] + 100) + "px");
						xPos2 = (mousex[1] < 50) ? 50 : ((mousex[1] + 550) + "px");
						xPos3 = (mousex[1] < 50) ? 50 : ((mousex[1] + 975) + "px");
						yPos = (mousex[0] > width) ? ((mousex[0] - 250) + "px") : ((mousex[0] + 100) + "px");
						where = "within Major";
						where2 = "within College";
						where3 = "within University";
						text = "<p>" + entities[entityVal] + "<br /><br />Incoming freshman for " + invertedx + " -  " + incoming + "<br /><br />" + pro + " (" + howMany + ") " + didWhat + " " + where + "</p>";
						text2 = "<p>" + entities[entityVal] + "<br /><br />Incoming freshman for " + invertedx + " -  " + incoming2 + "<br /><br />" + pro2 + " (" + howMany2 + ") " + didWhat2 + " " + where2 + "</p>";
						text3 = "<p>" + entities[entityVal] + "<br /><br />Incoming freshman for " + invertedx + " -  " + incoming3 + "<br /><br />" + pro3 + " (" + howMany3 + ") " + didWhat3 + " " + where3 + "</p>";
						d3.select(this).classed("hover", true).attr("stroke", strokecolor).attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos), tooltip2.html(text2).style("visibility", "visible").style("top", xPos2).style("left", yPos), tooltip3.html(text3).style("visibility", "visible").style("top", xPos3).style("left", yPos);
					}
				}).on("mouseout", function(d, i) {
					svg.selectAll(".layer").transition().duration(250).attr("opacity", "1");
					d3.select(this).classed("hover", false).attr("stroke-width", "0px"), tooltip.html("<p>" + d.key + "<br></p>").style("visibility", "hidden"), tooltip2.html("<p>" + d.key + "<br></p>").style("visibility", "hidden"), tooltip3.html("<p>" + d.key + "<br></p>").style("visibility", "hidden");
				});

				var vertical = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "19").style("width", "1px").style("height", "380px").style("top", "100px").style("bottom", "150px").style("left", "0px").style("background", "#fff");
				var top, h;

				if (chartState === 0 && chart3State === 2) {
					top = 230;
					h = 830;
				} else if (chart2State === 0) {
					top = 125;
					h = 380;
				} else if (chartState !== 0 && chart2State !== 0 && chart3State === 0) {
					if ($('.title').height() > 30) {
						top = 210;
						h = 825;
					} else {
						top = 190;
						h = 840;
					}
				} else {
					top = 200;
					h = 1275;
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

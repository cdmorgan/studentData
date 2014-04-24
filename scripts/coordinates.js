$(document).ready(function() {
	$('#slickGrid-container').bind('contentchanged', function() {
		alert('woo');
	});
});

var colors = {
	"avg" : "#008837",
	"All Institutions (Avg.)" : "#008837",
	"asu" : "#FDAE61",
	"Appalachian State University" : "#FDAE61",
	"ecu" : "#FFFFBF",
	"East Carolina University" : "#FFFFBF",
	"ecsu" : "#ABD9E9",
	"Elizabeth City State University" : "#ABD9E9",
	"fsu" : "#D7191C",
	"Fayetteville State University" : "#D7191C",
	"ncat" : "#A6611A",
	"NC A&T State University" : "#A6611A",
	"nccu" : "#DFC27D",
	"North Carolina Central University" : "#DFC27D",
	"ncsu" : "#F1B6DA",
	"NC State University" : "#F1B6DA",
	"asheville" : "#BABABA",
	"UNC Asheville" : "#BABABA",
	"ch" : "#80CDC1",
	"UNC Chapel Hill" : "#80CDC1",
	"charlotte" : "#1F78B4",
	"UNC Charlotte" : "#1F78B4",
	"greensboro" : "#018571",
	"UNC Greensboro" : "#018571",
	"pembroke" : "#4DAC26",
	"UNC Pembroke" : "#4DAC26",
	"wilmington" : "#B8E186",
	"UNC Wilmington" : "#B8E186",
	"arts" : "#7B3294",
	"UNC School of the Arts" : "#7B3294",
	"wcu" : "#C2A5CF",
	"Western Carolina University" : "#C2A5CF",
	"wssu" : "#D01C8B",
	"Winston-Salem State University" : "#D01C8B"
};

var schoolNames = {
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

var thisData = [], target, prevTarget = null, prevData, state = 0, prevState = 0, brushed = false;

var setData = function(arr) {
	thisData = arr;
};

function loadVisualization(e) {
	if (e) {
		target = $(e.currentTarget).attr("id");
	}

	brushed = false;
	state = (target === "revertButton") ? prevState : (target === "showButton") ? 1 : (target === "compareButton") ? 2 : (prevState === 1) ? 3 : 4;
	prevState = (state === 4) ? 2 : (state === 3) ? 1 : 0;
	
	var school1 = $('#selectSchool1 option:selected').val(),
		school1Proper = $('#selectSchool1 option:selected').text(),
		
		showData = $('#chooseData option:selected').val(),
		showDataProper = $('#chooseData option:selected').text(),
		
		school2 = $('#selectSchool2 option:selected').val(),
		school2Proper = $('#selectSchool2 option:selected').text();

	function clearData() {
		$('#d3-container, #slickGrid-container').empty();
		$('#currentData, #searchButton').hide();
		$('#slickGrid-container').removeClass('border');
	}

	if (showData === "default") {
		clearData();
		alert("Choose Data Set.");
	} else if (state === 1 || prevState === 3) {
		$('#currentData').html(showDataProper + " of " + school1Proper);
		$('#currentData, #searchButton').show();
		$('#searchButton').show();
		$('#revertButton, #textSearch, #searchBtn').hide();
		prevState = state;

		var dataPath = ("./data/" + showData + ".json");
		d3.json(dataPath, function(dataSet) {
			if (school1 === "all") {
				this.D3Vis(dataSet);
				loadTableVis(dataSet);
			} else {
				var data = [];
				for (var i in dataSet) {
					if (dataSet[i].Name === school1) {
						data.push(dataSet[i]);
					}
				}
				this.D3Vis(data);
				loadTableVis(data);
			}
		});
	} else if (state === 3) {
		$('#currentData').append(" (" + $("#textSearch").val() + ")");
		$('#revertButton').show();
		$('#textSearch, #searchBtn').hide();
		this.D3Vis(thisData);
		loadTableVis(thisData);
	} else if (state === 4) {
		$('#currentData').append(" (" + $("#textSearch").val() + ")");
		$('#revertButton').show();
		$('#textSearch, #searchBtn').hide();
		var dataSet = [];
		for (var i in thisData) {
			if (thisData[i].Name === school1 || thisData[i].Name === school2) {
				dataSet.push(thisData[i]);
			}
		}
		this.D3Vis(dataSet);
		loadTableVis(dataSet);
	} else {
		var dataPath = ("./data/" + showData + ".json");

		$('#revertButton').hide();

		if (school1 === "all") {
			clearData();
			alert("First choice can't be 'NC Institutions (Together)'.");
		} else if (school2 === "default") {
			clearData();
			alert("Choose a second school to compare.");
		} else if (school1 === school2) {
			clearData();
			alert("You must choose two different schools.");
		} else {
			d3.json(dataPath, function(dataSet) {
				var data = [];
				for (i in dataSet) {
					if (dataSet[i].Name === school1 || dataSet[i].Name === school2) {
						data.push(dataSet[i]);
					}
				}
				$('#currentData').html(showDataProper + " - Comparison between " + "<span style='color:" + colors[school1] + "'>" + school1Proper + "</span> and <span style='color:" + colors[school2] + "'>" + school2Proper + "</span>");
				$('#currentData, #searchButton').show();

				this.D3Vis(data);
				loadTableVis(data);
			});
		}
	}

	this.D3Vis = function(data) {

		$('#d3-container').empty();

		var m = [30, 10, 10, 10], w = 960 - m[1] - m[3], h = 500 - m[0] - m[2],
			x = d3.scale.ordinal().rangePoints([0, w], 1), y = {},
			line = d3.svg.line(), axis = d3.svg.axis().orient("left"), background, foreground,
			svg = d3.select("#d3-container").append("svg:svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		var loadGraph = function(dataSet) {

			x.domain( dimensions = d3.keys(dataSet[0]).filter(function(d) {
				var index = 0;
				return d !== "Name" && (dataSet.length === 2 ? d !== "Year of Entry" : d !== "Number in Class") && (y[d] = d3.scale.linear().domain(d3.extent(dataSet, function(p) {
					index++;
					return (+p[d] > 100) ? +p[d] : ((index % 11) === 1) ? 0 : (dataSet.length !== 2 && (index % 11) === 9) ? 100 : (dataSet.length === 2 && (index % 2) === 0) ? 100 : +p[d];
				})).range([h, 0]));
			}));

			background = svg.append("svg:g").attr("class", "background").selectAll("path").data(dataSet).enter().append("svg:path").attr("d", path);

			foreground = svg.append("svg:g").attr("class", "foreground").selectAll("path").data(dataSet).enter().append("svg:path").attr("d", path).attr("style", function(d) {
				return "stroke:" + colors[d.Name];
			});

			var g = svg.selectAll(".dimension").data(dimensions).enter().append("svg:g").attr("class", "dimension").attr("transform", function(d) {
				return "translate(" + x(d) + ")";
			});

			g.append("svg:g").attr("class", "axis").each(function(d) {
				d3.select(this).call(axis.scale(y[d]));
			}).append("svg:text").attr("text-anchor", "middle").attr("y", -9).text(String);

			g.append("svg:g").attr("class", "brush").each(function(d) {
				d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush).on("brushend", brushend));
			}).selectAll("rect").attr("x", -8).attr("width", 16);
		};
		if ( typeof data === "object") {
			loadGraph(data);
		} else {
			d3.csv(data, function(dataSet) {
				loadGraph(dataSet);
			});
		}

		function brushend() {
			var brushData = [];
			brushData.length = 0;

			var actives = dimensions.filter(function(p) {
				return !y[p].brush.empty();
			}), extents = actives.map(function(p) {
				return y[p].brush.extent();
			});

			brushed = (actives.length === 0) ? false : true;

			$.each(data, function(d) {
				var thisData = this;
				if (actives.every(function(p, i) {
					return extents[i][0] <= thisData[p] && thisData[p] <= extents[i][1];
				})) {
					thisData.row = d;
					brushData.push(thisData);
				}
			});
			loadTableVis(brushData);
		}

		function path(d) {
			return line(dimensions.map(function(p) {
				return [x(p), y[p](d[p])];
			}));
		}

		function brush() {
			var actives = dimensions.filter(function(p) {
				return !y[p].brush.empty();
			}), extents = actives.map(function(p) {
				return y[p].brush.extent();
			});

			foreground.attr("style", function(d) {
				return actives.every(function(p, i) {
					return extents[i][0] <= d[p] && d[p] <= extents[i][1];
				}) ? ("stroke:" + colors[d.Name]) : "display:none;";
			});
		}
	};
}

function loadTableVis(dataSet) {
	$('#slickGrid-container').empty();

	var dimensions = d3.keys(dataSet[0]);
	if (brushed) {
		var len = dimensions.length - 1;
		dimensions.splice(len, 1);
	}

	var grid,
		options = {
		enableCellNavigation : false,
		enableColumnReorder : false
	};

	function camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
			return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
		}).replace(/\s+/g, '');
	}

	var camelName = [];
	for (var i in dimensions) {
		camelName[i] = camelize(dimensions[i]);
	}

	var columns = [];
	for (var i = 0; i < dimensions.length; i++) {
		columns[i] = {
			id : camelName[i],
			name : dimensions[i],
			field : dimensions[i],
			sortable : false
		};
	}
	setData(dataSet);

	grid = new Slick.Grid("#slickGrid-container", dataSet, columns, options);

	$('#searchBtn').click(function() {
		performSearch(dataSet);
	});
	$("#textSearch").keypress(function(e) {
		if (e.which === 13) {
			performSearch(dataSet);
		}
	});

	$("#slickGrid-container").addClass("border");

	grid.onMouseLeave.subscribe(function(e, args) {
		var node = $(".foreground").children();
		$(e.currentTarget.parentElement).removeClass("hover");
		if (brushed) {
			$.each(dataSet, function(i) {
				var obj = this;
				$(node[this.row]).attr("style", function() {
					return "stroke:" + colors[obj.Name];
				});
			});
		} else {
			$.each(node, function() {
				$(this).attr("style", function() {
					return "stroke:" + colors[dataSet[node.index(this)].Name];
				});
			});
		}
	});

	grid.onMouseEnter.subscribe(function(e, args) {
		var node = $(".foreground").children(),
			canvas = $('.grid-canvas').children(),
			cell = args.grid.getCellFromEvent(e);

		$.each(canvas, function() {
			$(this).removeClass("hover");
		});

		$(canvas[cell.row]).addClass("hover");

		$.each(node, function() {
			$(this).attr("style", "display: none;");
		});

		if (brushed) {
			$(node[dataSet[cell.row].row]).attr("style", function() {
				return "stroke:" + colors[dataSet[cell.row].Name];
			});
		} else {
			var brush = d3.selectAll("rect.extent");
			$.each(brush, function() {
				$(this).attr("y", null).attr("height", null);
			});
			var stroke = e.currentTarget.parentElement.children[0].textContent;
			$(node[cell.row]).attr("style", function(d) {
				return "stroke:" + colors[stroke];
			});
		}
	});
}

function performSearch(data) {
	var fewer = [],
		val = Number($("#textSearch").val());

	$.each(data, function() {
		if (this["Year of Entry"] === val) {
			fewer.push(this);
		}
	});

	setData(fewer);
	loadVisualization(event);
}

function goBack() {
	loadVisualization(event);
}

function activeCellCheck() {
	var printWindow = window.open("print.html", "_blank");
}

function printerPage() {
	var dataSet = opener.thisData;
	$("title").html($(opener.document.getElementById("currentData")).text() + " (Selected Items)");

	var dimensions = d3.keys(dataSet[0]);
	if (opener.brushed) {
		var len = dimensions.length - 1;
		dimensions.splice(len, 1);
	}

	function header() {
		var heads = "";
		for (var i in dimensions) {
			heads += ("<th>" + dimensions[i] + "</th>");
		}
		return heads;
	}

	var data = "";
	$.each(dataSet, function() {
		var contents = "";
		for (var i in this) {
			if (i !== "row") {
				if (i == "Name") {
					contents += ("<td>" + opener.schoolNames[this[i]] + "</td>");
				} else {
					contents += ("<td>" + this[i] + "</td>");
				}
			}
		}
		data += ("<tr>" + contents + "</tr>");
	});

	printHeaders = header();

	$("#printGrid-container").append("<table border=1><tr>" + printHeaders + "</tr>" + data + "</table>");
}

$(function() {
	var checkStyle, chart1Data, chart2Data, dataYear, fullLength, state, c1State, c2State, text, collegeVal, college2Val, csvpath, csvpath2, majorVal, major2Val, dataVal, data2Val, dataText, data2Text, yearVal, year2Val;

	$('title').html("UNCC Data");

	function rows(num) {
		var btnId = (num === 1) ? "visualizeBtn" : "compareBtn";
		var btnTxt = (num === 1) ? "Visualize" : "Compare";
		var row = "<td width='265px'><select size='1' id='selectCollege" + num + "'><option value='default' selected='selected'>Select College</option><option value='clas'>College of Liberal Arts & Sciences</option><option value='cci'>College of Computing & Informatics</option><option value='coaa'>College of Arts & Architecture</option><option value='coe'>College of Engineering</option></select></td><td width='265px'><select size='1' id='selectMajor" + num + "' style='visibility: hidden'></select></td><td width='285px'><select size='1' id='selectData" + num + "' style='visibility: hidden'></select></td><td id='selectBox" + num + "' width='200px'></td><td width='85px'><button id='" + btnId + "' size='1' style='visibility: hidden'>" + btnTxt + "</button></td>";
		return row;
	}

	function charts(num) {
		var chartNum = (num === 1) ? "" : num;
		var chart = "<br /><br /><div class='chart" + chartNum + "Title center'></div><br /><span class='chart" + chartNum + "Legend'></span><div class='chart" + chartNum + "'></div>";
		return chart;
	}

	var body = "<div id='header'><table><tr>" + rows(1) + "</tr><tr>" + rows(2) + "</tr></table></div><br /><br /><br /><div class='title center'></div>" + charts(1) + charts(2);

	$('body').append(body);

	checkStyle = function() {
		function intersection(x, y) {
			var ret = [];
			for (var i = 0; i < x.length; i++) {
				for (var z = 0; z < y.length; z++) {
					if (x[i] == y[z]) {
						ret.push(x[i]);
						break;
					}
				}
			}
			return ret;
		}

		var years1 = [], years2 = [], yearSet, text = "<select size='1' id='selectView'><option value='default' selected='selected'>Select View</option><option value='all'>Two Graphs (All Years)</option><optgroup label='One Graph (Select Year)'>";
		d3.csv(csvpath, function(dataSet) {
			$.each(dataSet, function(i) {
				if (this.key === majorVal) {
					years1[i] = this.year;
				}
			});
			years1 = years1.filter(function(itm, i) {
				return i === years1.indexOf(itm);
			});
		});

		d3.csv(csvpath2, function(dataSet) {
			$.each(dataSet, function(i) {
				if (this.key === major2Val) {
					years2[i] = this.year;
				}
			});
			years2 = years2.filter(function(itm, i) {
				return i === years2.indexOf(itm);
			});
			yearSet = intersection(years1, years2);

			$.each(yearSet, function() {
				text += ("<option value='" + this + "'>" + this + "</option>");
			});
			text += "</optgroup></select>";
			return $('#selectBox2').html(text);
		});
	};

	$('#selectCollege1, #selectCollege2').change(function() {
		collegeVal = $('#selectCollege1 option:selected').val();
		college2Val = $('#selectCollege2 option:selected').val();
		var thisCollegeVal = (this.id === "selectCollege1") ? collegeVal : college2Val, majors = [], major = (this.id === "selectCollege1") ? '#selectMajor1' : '#selectMajor2', data = (this.id === "selectCollege1") ? '#selectData1' : '#selectData2', year = (this.id === "selectCollege1") ? '#selectYear1' : '#selectYear2', button = (this.id === "selectCollege1") ? '#visualizeBtn' : '#compareBtn', text = "<option value='default' selected='selected'>Select Major</option>";

		$(major).attr("style", "visibility: hidden");
		$(data).attr("style", "visibility: hidden");
		$(year).attr("style", "visibility: hidden");
		$(button).attr("style", "visibility: hidden");

		if (thisCollegeVal !== "default") {
			csvpath = ("./data/" + collegeVal + ".csv");
			csvpath2 = ("./data/" + college2Val + ".csv");
			var thisCSVPath = (this.id === "selectCollege1") ? csvpath : csvpath2;

			d3.csv(thisCSVPath, function(dataSet) {
				$.each(dataSet, function(i) {
					majors[i] = this.key;
				});
				majors = majors.filter(function(itm, i) {
					return i === majors.indexOf(itm);
				});
				$.each(majors, function() {
					text += ("<option value='" + this + "'>" + this + "</option>");
				});
				$(major).attr("style", "visibility: visible").html(text);
			});
		}
	});

	$('#selectMajor1, #selectMajor2').change(function() {
		majorVal = $('#selectMajor1 option:selected').val();
		major2Val = $('#selectMajor2 option:selected').val();
		var thisMajorVal = (this.id === "selectMajor1") ? majorVal : major2Val, lastValue = $('#' + this.id + ' option:last-child').val(), data = (this.id === "selectMajor1") ? '#selectData1' : '#selectData2', year = (this.id === "selectMajor1") ? '#selectYear1' : '#selectYear2', button = (this.id === "selectMajor1") ? '#visualizeBtn' : '#compareBtn', text = "<option value='default' selected='selected'>Select Data Set</option><option value='1'>Graduation, Retention, and Loss Rates</option>";
		if (thisMajorVal !== lastValue) {
			text += "<option value='3'>Graduation Rates in Major</option>";
		}
		text += "<option value='3'>Graduation Rates in College</option><option value='3'>Graduation Rates in University</option>";
		if (thisMajorVal !== lastValue) {
			text += "<option value='3'>Retention Rates in Major</option>";
		}
		text += "<option value='3'>Retention Rates in College</option><option value='3'>Retention Rates in University</option><option value='2'>All Persistence Rates</option>";
		if (thisMajorVal !== lastValue) {
			text += "<option value='3'>Persistence Rates in Major</option>";
		}
		text += "<option value='3'>Persistence Rates in College</option><option value='3'>Persistence Rates in University</option><option value='3'>Loss Rates in University</option>";
		$(data).attr("style", "visibility: hidden");
		$(year).attr("style", "visibility: hidden");
		$(button).attr("style", "visibility: hidden");
		if (thisMajorVal !== "default") {
			$(data).attr("style", "visibility: visible").html(text);
		}
	});

	$('#selectData1, #selectData2').change(function() {
		dataVal = $('#selectData1 option:selected').val();
		dataText = $('#selectData1 option:selected').text();
		data2Val = $('#selectData2 option:selected').val();
		data2Text = $('#selectData2 option:selected').text();
		var thisDataVal = (this.id === "selectData1") ? dataVal : data2Val, thisSelect = (this.id === "selectData1") ? "selectYear1" : "selectYear2", oneChart, years = [], text = "<select size='1' id='" + thisSelect + "'><option value='default' selected='selected'>Select Year</option>", box = (this.id === "selectData1") ? '#selectBox1' : '#selectBox2', button = (this.id === "selectData1") ? '#visualizeBtn' : '#compareBtn';

		$(box).empty();
		$(button).attr("style", "visibility: hidden");

		if (thisDataVal !== "default") {
			if (thisDataVal === "1" || thisDataVal === "2") {
				var thisCSVPath = (this.id === "selectData1") ? csvpath : csvpath2;
				var selectNum = (this.id === "selectData1") ? 1 : 2;
				d3.csv(thisCSVPath, function(dataSet) {
					$.each(dataSet, function(i) {
						if ((selectNum === 1 && this.key === majorVal) || (selectNum === 2 && this.key === major2Val)) {
							years[i] = this.year;
						}
					});
					years = years.filter(function(itm, i) {
						return i === years.indexOf(itm);
					});
					$.each(years, function() {
						text += ("<option value='" + this + "'>" + this + "</option>");
					});
					text += "</select>";
					$(box).html(text);
				});
			} else {
				if (button === "#visualizeBtn") {
					$(button).attr("style", "visibility: visible").on("click", function(event) {
						$('#selectCollege2>option:eq(0), #selectMajor2>option:eq(0), #selectData2>option:eq(0),#selectYear2>option:eq(0)').prop('selected', true);
						$('#selectMajor2, #selectData2, #selectYear2, #compareBtn').attr("style", "visibility: hidden");
						$('#selectBox2').empty();
						showChart(event.target.id, '.chart', dataVal, data2Val, csvpath, csvpath2, dataText, data2Text, majorVal, major2Val, yearVal, year2Val, collegeVal, college2Val, null, null, checkStyle);
					});
				} else {
					$(button).attr("style", "visibility: visible").on("click", function(event) {
						var viewVal = $('#selectView>option:selected').val() || $('#selectView>optgroup>option:selected').val(), yearVal = $('#selectYear1 option:selected').val(), checkOpts = (collegeVal === "default") ? alert("Select first college") : (!majorVal || majorVal === "default") ? alert("Select first major") : (dataVal === "3" && data2Val === "3" && !viewVal) ? checkStyle() : (viewVal === "default") ? alert("Select a View") : (viewVal && viewVal !== "all") ? alert("Under Construction") : (!dataVal || dataVal === "default") ? alert("Select first data set") : ((dataVal === "1" || dataVal === "2") && (!yearVal || yearVal === "default")) ? alert("Select first year") : showChart(event.target.id, '.chart', dataVal, data2Val, csvpath, csvpath2, dataText, data2Text, majorVal, major2Val, yearVal, year2Val, collegeVal, college2Val, null, null, checkStyle);
					});
				}
			}
		}
	});

	$('#selectBox1, #selectBox2').on('change', '#selectYear1, #selectYear2', function() {
		var button = (this.id === "selectYear1") ? '#visualizeBtn' : '#compareBtn';

		yearVal = $('#selectYear1 option:selected').val();
		year2Val = $('#selectYear2 option:selected').val();

		$(button).attr("style", "visibility: visible").on("click", function(event) {
			if (button === "#visualizeBtn") {
				$('#selectCollege2>option:eq(0), #selectMajor2>option:eq(0), #selectData2>option:eq(0),#selectYear2>option:eq(0)').prop('selected', true);
				$('#selectMajor2, #selectData2, #selectYear2, #compareBtn').attr("style", "visibility: hidden");
				$('#selectBox2').empty();
				showChart(event.target.id, '.chart', dataVal, data2Val, csvpath, csvpath2, dataText, data2Text, majorVal, major2Val, yearVal, year2Val, collegeVal, college2Val, null, null, checkStyle);
			} else {
				var checkOpts = (collegeVal === "default") ? alert("Select first college") : (!majorVal || majorVal === "default") ? alert("Select first major") : (!dataVal || dataVal === "default") ? alert("Select first data set") : ((dataVal === "1" || dataVal === "2") && (!yearVal || yearVal === "default")) ? alert("Select first year") : showChart(event.target.id, '.chart', dataVal, data2Val, csvpath, csvpath2, dataText, data2Text, majorVal, major2Val, yearVal, year2Val, collegeVal, college2Val, null, null, checkStyle);
			}
		});
	});
});

function showChart(e, chart, dataVal, data2Val, csvpath, csvpath2, dataText, data2Text, major, major2, year, year2, collegeText, college2Text, state, chart2State, styleBox) {

	var box;
	state = (e === "visualizeBtn") ? 0 : (e === "compareBtn") ? 1 : state;
	c1State = (dataVal === "1" || dataVal === "2") ? 1 : 2;
	c2State = (e === "visualizeBtn" || chart2State === 0) ? 0 : (data2Val === "1" || data2Val === "2") ? 1 : 2;
	fullLength = (dataVal === data2Val && c2State !== 0) ? true : false;

	if ($('#selectBox2').children().length === 1 && $('#selectBox2').children().attr('id') === "selectView") {
		box = $('#selectBox2').children().html();
	}

	$(".title").empty();

	function emptyOne() {
		var chartTitle = (chart + "Title"), chartLegend = (chart + "Legend");
		$(chart).empty();
		$(chartTitle).empty();
		$(chartLegend).empty();
	}

	function emptyBoth() {
		$(".chart, .chart2, .chartTitle, .chart2Title, .chartLegend, .chart2Legend").empty();
	}

	var empty = (state === 2 || state === 3) ? emptyOne() : emptyBoth();

	function setChartTitles(val) {
		var isMajor1, isYear1 = (c1State === 1 && year !== year2) ? (" (" + year + ")") : "", isMajor2, isYear2 = (c2State === 1 && year !== year2) ? (" (" + year2 + ")") : "";

		if (val) {
			isMajor1 = (major === major2) ? "" : major;
			isMajor2 = (major === major2) ? "" : major2;
			$('.chartTitle').html(isMajor1 + isYear1);
			$('.chart2Title').html(isMajor2 + isYear2);
		} else {
			isMajor1 = (major === major2) ? "" : (" for " + major);
			isMajor2 = (major === major2) ? "" : (" for " + major2);
			$('.chartTitle').html(dataText + isMajor1 + isYear1);
			$('.chart2Title').html(data2Text + isMajor2 + isYear2);
		}

	}

	function loadOne() {

		function firstLoad() {
			var isYear = (c1State === 1) ? (" (" + year + ")") : "";
			$('.title').html("Comparing " + dataText + " for " + major + isYear);
		}

		function reload() {

			function setOneData() {
				var isYear = ((state === 2 && c1State === 1) || (state === 3 && c2State === 1)) ? (" (" + year + ")") : "";
				$('.title').html("Comparing " + dataText + " for " + major + isYear);
			}

			function setTwoData() {

				function setSameData() {
					var currentData = (c1State === 1 && c2State === 1 && year === year2 && major === major2) ? (major + " (" + year + ")") : (c1State === 1 && c2State === 1 && year === year2 && major !== major2) ? (major + " (" + year + ") & " + major2 + " (" + year2 + ")") : (c1State === 1 && c2State === 1 && year !== year2 && major === major2) ? (major + " (" + year + " & " + year2 + ")") : (c1State === 1 && c2State === 1 && year !== year2 && major !== major2) ? (major + " (" + year + ") & " + major2 + " (" + year2 + ")") : (c1State === 2 && c2State === 2 && major === major2) ? major : (major + " & " + major2);
					$('.title').html("Comparing " + dataText + " for<br />" + currentData);
					setChartTitles(true);
				}

				function setDiffData() {
					var currentData = (c1State === 1 && c2State === 1 && year === year2 && major === major2) ? (dataText + " & " + data2Text + " for " + major + " (" + year + ")") : (c1State === 1 && c2State === 1 && year === year2 && major !== major2) ? (dataText + " for " + major + " (" + year + ")<br />& " + data2Text + " for " + major + " (" + year + ")") : (c1State === 1 && c2State === 1 && year !== year2 && major === major2) ? (dataText + " (" + year + ")<br />& " + data2Text + " (" + year2 + ") for " + major) : (c1State === 1 && c2State === 1 && year !== year2 && major !== major2) ? (dataText + " for " + major + " (" + year + ")<br />& " + data2Text + " for " + major2 + " (" + year2 + ")") : (c1State === 2 && c2State === 2 && major === major2) ? (dataText + " & " + data2Text + " for " + major) : (c1State === 2 && c2State === 2 && major !== major2) ? (dataText + " for " + major + "<br />& " + data2Text + " for " + major2) : (c1State === 1 && c2State === 2 && major === major2) ? (dataText + " (" + year + ")<br />& " + data2Text + " for " + major) : (c1State === 1 && c2State === 2 && major !== major2) ? (dataText + " for " + major + " (" + year + ")<br />& " + data2Text + " for " + major2) : (c1State === 2 && c2State === 1 && major === major2) ? (dataText + " & " + data2Text + " (" + year2 + ") for " + major) : (dataText + " for " + major + "<br />& " + data2Text + " for " + major2 + " (" + year2 + ")");
					$('.title').html("Comparing " + currentData);
					setChartTitles(false);
				}

				var set = (dataText === data2Text) ? setSameData() : setDiffData();
			}

			var setNum = (c1State === 0 || c2State === 0) ? setOneData() : setTwoData();
		}

		var loadSeq = (state === 2 || state === 3) ? reload() : firstLoad();

		var thisCSVPath = (chart === ".chart") ? csvpath : csvpath2;

		loadVis(thisCSVPath, chart);
	}

	function loadTwo() {

		function setOneData() {
			var currentData = (c1State === 1 && c2State === 1 && year === year2 && major === major2) ? (major + " (" + year + ")") : (c1State === 1 && c2State === 1 && year === year2 && major !== major2) ? (major + " (" + year + ") & " + major2 + " (" + year2 + ")") : (c1State === 1 && c2State === 1 && year !== year2 && major === major2) ? (major + " (" + year + " & " + year2 + ")") : (c1State === 1 && c2State === 1 && year !== year2 && major !== major2) ? (major + " (" + year + ") & " + major2 + " (" + year2 + ")") : (c1State === 2 && c2State === 2 && major === major2) ? major : (major + " & " + major2);
			$('.title').html("Comparing " + dataText + " for<br />" + currentData);
			setChartTitles(true);
			loadVis(csvpath, ".chart");
			loadVis(csvpath2, ".chart2");
		}

		function setTwoData() {
			var currentData = (c1State === 1 && c2State === 1 && year === year2 && major === major2) ? (dataText + " & " + data2Text + " for " + major + " (" + year + ")") : (c1State === 1 && c2State === 1 && year === year2 && major !== major2) ? (dataText + " for " + major + " (" + year + ")<br />& " + data2Text + " for " + major + " (" + year + ")") : (c1State === 1 && c2State === 1 && year !== year2 && major === major2) ? (dataText + " (" + year + ")<br />& " + data2Text + " (" + year2 + ") for " + major) : (c1State === 1 && c2State === 1 && year !== year2 && major !== major2) ? (dataText + " for " + major + " (" + year + ")<br />& " + data2Text + " for " + major2 + " (" + year2 + ")") : (c1State === 2 && c2State === 2 && major === major2) ? (dataText + " & " + data2Text + " for " + major) : (c1State === 2 && c2State === 2 && major !== major2) ? (dataText + " for " + major + "<br />& " + data2Text + " for " + major2) : (c1State === 1 && c2State === 2 && major === major2) ? (dataText + " (" + year + ")<br />& " + data2Text + " for " + major) : (c1State === 1 && c2State === 2 && major !== major2) ? (dataText + " for " + major + " (" + year + ")<br />& " + data2Text + " for " + major2) : (c1State === 2 && c2State === 1 && major === major2) ? (dataText + " & " + data2Text + " for " + major + " (" + year2 + ")") : (dataText + " for " + major + "<br />& " + data2Text + " for " + major2 + " (" + year2 + ")");
			$('.title').html("Comparing " + currentData);
			setChartTitles(false);
			loadVis(csvpath, ".chart");
			loadVis(csvpath2, ".chart2");
		}

		var setNum = (dataText === data2Text) ? setOneData() : setTwoData();
	}

	var loadNum = (state === 0 || state === 2 || state === 3) ? loadOne() : loadTwo();

	function loadVis(path, thisChart) {
		var thisChartState = (thisChart === ".chart") ? c1State : c2State, colorrange = {
			1999 : "#008837",
			2000 : "#A6DBA0",
			2001 : "#2C7BB6",
			2002 : "#ABD9E9",
			2003 : "#FDAE61",
			2004 : "#FFFFBF",
			2005 : "#D7191C",
			2006 : "#5E3C99",
			2007 : "#B2ABD2",
			2008 : "#404040",
			2009 : "#BABABA",
			2010 : "#D01C8B",
			2011 : "#F1B6DA",
			"Graduated in Major" : "#008837",
			"Retained in Major" : "#A6DBA0",
			"Graduated in College" : "#2C7BB6",
			"Retained in College" : "#ABD9E9",
			"Graduated in University" : "#FDAE61",
			"Retained in University" : "#FFFFBF",
			"Lost" : "#D7191C",
			"Lost from University" : "#D7191C",
			"in Major" : "#008837",
			"Persisted in Major" : "#008837",
			"in College" : "#A6DBA0",
			"Persisted in College" : "#A6DBA0",
			"in University" : "#FFFFBF",
			"Persisted in University" : "#FFFFBF"
		};

		var margin = {
			top : 20,
			right : 40,
			bottom : 30,
			left : 30
		}, width = document.body.clientWidth - margin.left - margin.right, height = 400 - margin.top - margin.bottom, tooltip = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "20").style("visibility", "hidden").style("top", "115px").style("left", "55px"), tooltip2 = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "20").style("visibility", "hidden").style("top", "115px").style("left", "55px");

		$.contextMenu({
			selector : '.layer',
			callback : function(key, options) {
				var major = ($(this).parents("div").attr("class") === 'chart') ? $('#selectMajor1 option:selected').val() : $('#selectMajor2 option:selected').val(), last = ($(this).parents("div").attr("class") === 'chart') ? $('#selectMajor1 option:last-child').val() : $('#selectMajor2 option:last-child').val(), college = ($(this).parents("div").attr("class") === 'chart') ? $('#selectCollege1 option:selected').val() : $('#selectCollege2 option:selected').val();

				function openData(popUp) {
					var generator = window.open('', 'name', 'scrollbars=1,height=400,width=600,location=no');

					generator.document.write('<html><head><title>Changes for ' + major + '</title>');
					generator.document.write(popUp);
					generator.document.write('</body></html>');
					generator.document.close();
				}

				if (major === last) {
					d3.csv('./data/' + college + 'Data.csv', function(data) {
						var prevKey = '', popUp = '';
						$.each(data, function() {
							if (this.year === dataYear.toString()) {
								if (this.key !== prevKey) {
									popUp += "<p style='text-decoration: underline; font-weight: bold'>Department of " + this.key + " (" + dataYear + ")</p><ul>";
									prevKey = this.key;
								}
								popUp += "<li>" + this.change + "</li>";
							} else {
								popUp += "</ul>";
							}
						});
						openData(popUp);
					});

				} else {
					d3.csv('./data/' + college + 'Data.csv', function(data) {
						var popUp = "<p style='text-decoration: underline; font-weight: bold'>Department of " + major + " (" + dataYear + ")</p><ul>";
						$.each(data, function() {
							if (this.key === major && this.year === dataYear.toString()) {
								popUp += "<li>" + this.change + "</li>";
							}
						});
						popUp += "</ul>";
						openData(popUp);
					});
				}
			},
			items : {
				"display" : {
					name : "Display Information",
					icon : "info"
				}
			}
		});

		var x = d3.scale.linear().range([0, width]), y = d3.scale.linear().range([height - 10, 0]), z = d3.scale.ordinal().range(colorrange), xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10), yAxis = d3.svg.axis().scale(y), yAxisr = d3.svg.axis().scale(y), stack = d3.layout.stack().offset("silhouette").values(function(d) {
			return d.values;
		}).x(function(d) {
			return d.delay;
		}).y(function(d) {
			return (d.value / d["new students"]) * 100;
		}), nest = d3.nest().key(function(d) {
			return (thisChartState === 1) ? d.key : d.year;
		}), area = d3.svg.area().interpolate("cardinal").x(function(d) {
			return x(d.delay);
		}).y0(function(d) {
			return y(d.y0);
		}).y1(function(d) {
			return y(d.y0 + d.y);
		}), svg = d3.select(thisChart).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"), graph = d3.csv(path, function(thisDataSet) {
			var thisChartYear, thisChartMajor, thisChartData, dataYears, data = [];

			if (thisChartState === 1) {
				thisChartYear = (thisChart === ".chart") ? year.toString() : year2.toString();
			}
			if (major || major2) {
				thisChartMajor = (thisChart === ".chart") ? major : major2;
			}
			if (dataText || data2Text) {
				thisChartData = (thisChart === ".chart") ? dataText : data2Text;
			}

			function formatYear(all, key1, key2, key3, value1, value2, value3, value4, value5, value6) {
				var obj1, obj2, obj3, obj4, obj5, obj6, obj7, temp = data;
				data = [];
				if (!all) {
					$.each(temp, function(i) {
						if (this[value1] === "null") {
							this[value1] = 0;
						}
						if (this[value2] === "null") {
							this[value2] = 0;
						}
						if (this[value3] === "null") {
							this[value3] = 0;
						}
						if (this[value4] === "null") {
							this[value4] = 0;
						}
						if (this[value5] === "null") {
							this[value5] = 0;
						}
						if (this[value6] === "null") {
							this[value6] = 0;
						}
						if (this.lost === "null") {
							this.lost = 0;
						}

						obj1 = {
							delay : this.delay,
							key : ("Graduated " + key1),
							value : this[value1],
							"new students" : this["new students"],
							year : this.year
						};
						obj2 = {
							delay : this.delay,
							key : ("Retained " + key1),
							value : this[value2],
							"new students" : this["new students"],
							year : this.year
						};
						obj3 = {
							delay : this.delay,
							key : ("Graduated " + key2),
							value : this[value3] - this[value1],
							"new students" : this["new students"],
							year : this.year
						};
						obj4 = {
							delay : this.delay,
							key : ("Retained " + key2),
							value : this[value4] - this[value2],
							"new students" : this["new students"],
							year : this.year
						};
						obj5 = {
							delay : this.delay,
							key : ("Graduated " + key3),
							value : this[value5] - this[value3],
							"new students" : this["new students"],
							year : this.year
						};
						obj6 = {
							delay : this.delay,
							key : ("Retained " + key3),
							value : this[value6] - this[value4],
							"new students" : this["new students"],
							year : this.year
						};
						obj7 = {
							delay : this.delay,
							key : "Lost",
							value : this.lost,
							"new students" : this["new students"],
							year : this.year
						};
						data[i] = obj1;
						data[i + temp.length] = obj2;
						data[i + 2 * temp.length] = obj3;
						data[i + 3 * temp.length] = obj4;
						data[i + 4 * temp.length] = obj5;
						data[i + 5 * temp.length] = obj6;
						data[i + 6 * temp.length] = obj7;
					});
				} else {
					$.each(temp, function(i) {
						if (this[value1] === "null") {
							this[value1] = 0;
						}
						if (this[value2] === "null") {
							this[value2] = 0;
						}
						if (this[value3] === "null") {
							this[value3] = 0;
						}
						if (this.lost === "null") {
							this.lost = 0;
						}

						obj1 = {
							delay : this.delay,
							key : key1,
							value : this[value1],
							"new students" : this["new students"],
							year : this.year
						};
						obj2 = {
							delay : this.delay,
							key : key2,
							value : this[value2] - this[value1],
							offset : this[value2] - this[value1],
							"new students" : this["new students"],
							year : this.year
						};
						obj3 = {
							delay : this.delay,
							key : key3,
							value : this[value3] - this[value2],
							offset : this[value3] - this[value2],
							"new students" : this["new students"],
							year : this.year
						};
						obj4 = {
							delay : this.delay,
							key : "Lost",
							value : this.lost,
							"new students" : this["new students"],
							year : this.year
						};
						data[i] = obj1;
						data[i + temp.length] = obj2;
						data[i + 2 * temp.length] = obj3;
						data[i + 3 * temp.length] = obj4;
					});
				}

				data.forEach(function(d) {
					d.year = +d.year;
					d.value = +d.value;
					d["new students"] = +d["new students"];
					d.delay = +d.delay;
				});
				if (thisChart === '.chart') {
					chart1Data = data;
				} else {
					chart2Data = data;
				}
				return data;
			}

			function formatMajor(value) {
				var obj, temp = data;

				data = [];

				$.each(temp, function() {
					if (this[value] === "null") {
						this[value] = 0;
					}

					obj = {
						delay : this.delay,
						key : this.year,
						value : this[value],
						year : this.year,
						"new students" : this["new students"]
					};
					data.push(obj);
				});

				data.forEach(function(d) {
					d.year = +d.year;
					d.value = +d.value;
					d["new students"] = +d["new students"];
					d.delay = +d.delay;
				});
				if (thisChart === '.chart') {
					chart1Data = data;
				} else {
					chart2Data = data;
				}

				dataYears = [];
				data.forEach(function(d) {
					dataYears.push(d.key);
				});
				dataYears = dataYears.filter(function(itm, i) {
					return i === dataYears.indexOf(itm);
				});

				return data;
			}

			function byYear(d) {
				d.forEach(function(d) {
					if (d.year === thisChartYear && d.key === thisChartMajor) {
						data.push(d);
					}
				});

				data = (thisChartData === "Graduation, Retention, and Loss Rates") ? formatYear(false, "in Major", "in College", "in University", "gim", "rim", "gic", "ric", "giu", "riu") : formatYear(true, "in Major", "in College", "in University", "pim", "pic", "piu");

			}

			function byMajor(d) {
				d.forEach(function(d) {
					if (d.key === thisChartMajor) {
						data.push(d);
					}
				});

				data = (thisChartData === "Graduation Rates in Major") ? formatMajor("gim") : (thisChartData === "Graduation Rates in College") ? formatMajor("gic") : (thisChartData === "Graduation Rates in University") ? formatMajor("giu") : (thisChartData === "Retention Rates in Major") ? formatMajor("rim") : (thisChartData === "Retention Rates in College") ? formatMajor("ric") : (thisChartData === "Retention Rates in University") ? formatMajor("riu") : (thisChartData === "Persistence Rates in Major") ? formatMajor("pim") : (thisChartData === "Loss Rates in University") ? formatMajor("lost") : (thisChartData === "Persistence Rates in College") ? formatMajor("pic") : formatMajor("piu");

			}

			var setData = (thisChartState === 1) ? byYear(thisDataSet) : byMajor(thisDataSet), layers = stack(nest.entries(data));

			x.domain(d3.extent(data, function(d) {
				return d.delay;
			}));
			y.domain([0, d3.max(data, function(d) {
				return d.y0 + d.y;
			})]);

			svg.selectAll(".layer").data(layers).enter().append("path").attr("class", "layer").attr("d", function(d) {
				return area(d.values);
			}).style("fill", function(d) {
				return colorrange[d.key];
			});

			svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

			svg.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ", 0)").call(yAxis.orient("right"));

			svg.append("g").attr("class", "y axis").call(yAxis.orient("left"));

			var legend = '<svg>', cx = 50;

			if (thisChartState === 1) {
				var selection = (thisChart === ".chart") ? $('#selectMajor1>option:last-child') : $('#selectMajor2>option:last-child'), pers = selection.prop('selected') ? ["Persisted in College", "Persisted in University", "Lost from University"] : ["Persisted in Major", "Persisted in College", "Persisted in University", "Lost from University"], all = selection.prop('selected') ? ["Graduated in College", "Retained in College", "Graduated in University", "Retained in University", "Lost from University"] : ["Graduated in Major", "Retained in Major", "Graduated in College", "Retained in College", "Graduated in University", "Retained in University", "Lost from University"], text = (thisChartData === "All Persistence Rates") ? pers : all;

				for (var i = 0; i < text.length; i++) {
					legend += '<circle cx="' + cx + '" cy="25" r="10" fill="' + colorrange[text[i]] + '" style="float: left"></circle><text dx="' + (cx + 15) + '" dy="2.75em" text-anchor="start">' + text[i] + '</text>';
					cx += 175;
				}
				legend += '</svg>';
			} else {
				dataYears.forEach(function(d, i) {
					legend += '<circle cx="' + cx + '" cy="25" r="10" fill="' + colorrange[dataYears[i]] + '" style="float: left"></circle><text dx="' + (cx + 15) + '" dy="2.75em" text-anchor="start">' + dataYears[i] + '</text>';
					cx += 90;
				});
				legend += '</svg>';
			}

			var append = (thisChart === ".chart") ? $('.chartLegend').html(legend) : $('.chart2Legend').html(legend);

			svg.selectAll(".layer").attr("opacity", 1).on("mouseover", function(d, i) {
				svg.selectAll(".layer").transition().duration(250).attr("opacity", function(d, j) {
					return j !== i ? 0.6 : 1;
				});
			}).on("mousemove", function(d, i) {
				var pro, pro2, incoming, incoming2, action, action2, where, where2, text, text2, howMany, howMany2, xPos, xPos2, yPos, year, year2, format = d3.format('.4p'), width = document.width / 2;
				mousex = d3.mouse(this);
				var invertedx = x.invert(mousex[0]);
				invertedx = Math.round(invertedx);
				var time = (invertedx > 1) ? " years" : " year";
				dataText = $('#selectData1 option:selected').text();
				data2Text = $('#selectData2 option:selected').text();

				dataYear = d.values[0].year;

				if (fullLength) {
					var val1 = [], val2 = [];
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
						if (this.delay === invertedx) {
							pro = format(this.value / this["new students"]);
							incoming = this["new students"];
							howMany = this.value;
							year = this.year;
							action = (dataText === "Graduation Rates in Major" || dataText === "Graduation Rates in College" || dataText === "Graduation Rates in University") ? "Graduated" : (dataText === "Retention Rates in Major" || dataText === "Retention Rates in College" || dataText === "Retention Rates in University") ? "Retained" : (dataText === "All Persistence Rates" || dataText === "Persistence Rates in Major" || dataText === "Persistence Rates in College" || dataText === "Persistence Rates in University") ? "Persisted" : (dataText === "Loss Rates in University") ? "Lost" : d.key;
						}
					});
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
						if (this.delay === invertedx) {
							pro2 = format(this.value / this["new students"]);
							incoming2 = this["new students"];
							howMany2 = this.value;
							year2 = this.year;
							action2 = (data2Text === "Graduation Rates in Major" || data2Text === "Graduation Rates in College" || data2Text === "Graduation Rates in University") ? "Graduated" : (data2Text === "Retention Rates in Major" || data2Text === "Retention Rates in College" || data2Text === "Retention Rates in University") ? "Retained" : (data2Text === "All Persistence Rates" || data2Text === "Persistence Rates in Major" || data2Text === "Persistence Rates in College" || data2Text === "Persistence Rates in University") ? "Persisted" : (data2Text === "Loss Rates in University") ? "Lost" : d.key;
						}
					});
					
					xPos = (mousex[1] < 95) ? 95 : ((mousex[1] + 150) + "px");
					xPos2 = (mousex[1] < 95) ? 95 : ((mousex[1] + 650) + "px");
					yPos = (mousex[0] > width) ? ((mousex[0] - 275) + "px") : ((mousex[0] + 100) + "px");
					where = (dataText === "Loss Rates in University") ? (" from University after " + invertedx + time) : (dataText === "All Persistence Rates") ? (d.key + " after " + invertedx + time) : ("after " + invertedx + time);
					where2 = (data2Text === "Loss Rates in University") ? (" from University after " + invertedx + time) : (data2Text === "All Persistence Rates") ? (d.key + " after " + invertedx + time) : ("after " + invertedx + time);
					text = "<p>" + major + "<br /><br />Incoming freshmen for " + year + " -  " + incoming + "<br /><br />" + pro + " (" + howMany + ") " + action + " " + where + "</p>";
					text2 = "<p>" + major2 + "<br /><br />Incoming freshmen for " + year2 + " -  " + incoming2 + "<br /><br />" + pro2 + " (" + howMany2 + ") " + action2 + " " + where2 + "</p>";

					d3.select(this).classed("hover", true).attr("stroke", "#000").attr("stroke-width", "0.5px");
					if (year !== undefined) {
						tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos);
					}
					if (year2 !== undefined) {
						tooltip2.html(text2).style("visibility", "visible").style("top", xPos2).style("left", yPos);
					}
				} else {
					$.each(d.values, function() {
						if (this.delay === invertedx) {
							pro = format(this.value / this["new students"]);
							incoming = this["new students"];
							howMany = this.value;
							year = this.year;
							action = (d.key === "Lost" || thisChartData === "Loss Rates in University") ? "Lost" : (thisChartData === "Graduation Rates in Major" || thisChartData === "Graduation Rates in College" || thisChartData === "Graduation Rates in University") ? "Graduated" : (thisChartData === "Retention Rates in Major" || thisChartData === "Retention Rates in College" || thisChartData === "Retention Rates in University") ? "Retained" : (thisChartData === "All Persistence Rates" || thisChartData === "Persistence Rates in Major" || thisChartData === "Persistence Rates in College" || thisChartData === "Persistence Rates in University") ? "Persisted" : d.key;
						}
					});

					xPos = (mousex[1] < 95) ? 95 : (thisChart === ".chart") ? ((mousex[1] + 150) + "px") : (thisChart === ".chart2") ? ((mousex[1] + 650) + "px") : ((mousex[1] + 975) + "px");
					yPos = (mousex[0] > width) ? ((mousex[0] - 275) + "px") : ((mousex[0] + 100) + "px");
					entityKey = (thisChart === ".chart") ? major : major2;
					where = (d.key === "Lost" || thisChartData === "Loss Rates in University") ? (" from University after " + invertedx + time) : (thisChartData === "All Persistence Rates") ? (d.key + " after " + invertedx + time) : ("after " + invertedx + time);
					text = "<p>" + entityKey + "<br /><br />Incoming freshmen for " + year + " -  " + incoming + "<br /><br />" + pro + " (" + howMany + ") " + action + " " + where + "</p>";

					d3.select(this).classed("hover", true).attr("stroke", "#000").attr("stroke-width", "0.5px"), tooltip.html(text).style("visibility", "visible").style("top", xPos).style("left", yPos);
				}
			}).on("mouseout", function(d, i) {
				svg.selectAll(".layer").transition().duration(250).attr("opacity", "1");
				d3.select(this).classed("hover", false).attr("stroke-width", "0px"), tooltip.html("<p>" + d.key + "<br></p>").style("visibility", "hidden"), tooltip2.html("<p>" + d.key + "<br></p>").style("visibility", "hidden");
			}).on("click", function(d, i) {
				var dropDown, year, year2, state, key = d.key, chart2State = c2State;
				thisChart = ($(this).parents("div").attr("class"));

				function makeYears(num) {
					var years = [], text = "<select id='selectYear" + num + "' size='1'><option value='default' selected='selected'>Select Year</option>", thisCSVPath = (num === "1") ? csvpath : csvpath2;
					if (num === "1") {
						year = key;
						year2 = $('#selectYear2 option:selected').val();
					} else {
						year = $('#selectYear1 option:selected').val();
						year2 = key;
					}

					d3.csv(thisCSVPath, function(dataSet) {
						$.each(dataSet, function(i) {
							years[i] = this.year;
						});
						years = years.filter(function(itm, i) {
							return i === years.indexOf(itm);
						});
						$.each(years, function() {
							text += ("<option value='" + this + "'>" + this + "</option>");
						});
						text += "</select>";
						$('#selectBox' + num + '').html(text);

						var len = $('#selectYear' + num + '>option').length;
						for (var i = 0; i < len; i++) {
							if ($('#selectYear' + num + '>option:eq(' + i + ')').text() === key) {
								$('#selectYear' + num + '>option:eq(' + i + ')').prop('selected', true);
							}
						}
					});
				}

				function changeData(num) {
					if (num === "1") {
						year = key;
						year2 = $('#selectYear2 option:selected').val();
					} else {
						year = $('#selectYear1 option:selected').val();
						year2 = key;
					}
					if (!$('#selectMajor' + num + '>option:last-child').prop('selected')) {
						if (key === "Graduated in Major") {
							$('#selectData' + num + '>option:eq(2)').prop('selected', true);
						} else if (key === "Retained in Major") {
							$('#selectData' + num + '>option:eq(5)').prop('selected', true);
						} else if (key === "Graduated in College") {
							$('#selectData' + num + '>option:eq(3)').prop('selected', true);
						} else if (key === "Retained in College") {
							$('#selectData' + num + '>option:eq(6)').prop('selected', true);
						} else if (key === "Graduated in University") {
							$('#selectData' + num + '>option:eq(4)').prop('selected', true);
						} else if (key === "Retained in University") {
							$('#selectData' + num + '>option:eq(7)').prop('selected', true);
						} else {//(key === "Lost")
							$('#selectData' + num + '>option:eq(12)').prop('selected', true);
						}
					} else {
						if (key === "Graduated in College") {
							$('#selectData' + num + '>option:eq(2)').prop('selected', true);
						} else if (key === "Retained in College") {
							$('#selectData' + num + '>option:eq(4)').prop('selected', true);
						} else if (key === "Graduated in University") {
							$('#selectData' + num + '>option:eq(3)').prop('selected', true);
						} else if (key === "Retained in University") {
							$('#selectData' + num + '>option:eq(5)').prop('selected', true);
						} else {//(key === "Lost")
							$('#selectData' + num + '>option:eq(9)').prop('selected', true);
						}
					}
				}

				function modalSelect() {
					function chooseOption() {
						var selectedOption = $('#clonedView>option:selected').val() || $('#clonedView>optgroup>option:selected').val();

						function changeView() {
							var len = $('#selectView>optgroup').children().length;
							for (var i = 0; i < len; i++) {
								if ($('#selectView>optgroup>option:eq(' + i + ')').val() === selectedOption) {
									$('#selectView>optgroup>option:eq(' + i + ')').prop('selected', true);
								}
							}
						}

						var showChart = (selectedOption === "default") ? $("<div style='font-size: 20px'>Select a View</div>").dialog() : (selectedOption && selectedOption !== "all") ? ($("<div style='font-size: 20px'>Under Contruction</div>").dialog(), changeView()) : ($(cloned).dialog("close"), showContent(), $('#selectView>option:eq(1)').prop('selected', true));
					}

					var cloned;
					setTimeout(function() {
						cloned = $('#selectBox2').clone().attr('id', 'clone');
						cloned.children().attr('id', 'clonedView');
					}, 100);

					setTimeout(function() {
						$(cloned).dialog({
							title : "Options",
							buttons : {
								OK : chooseOption
							},
							autoOpen : false,
							modal : true,
							draggable : false
						});
						$(cloned).dialog("open");
						$(".ui-dialog-titlebar button:contains('close')").button("disable");
					}, 110);

				}

				function checkChart() {
					chart = ".chart", state = 2;
					if ($('#selectBox2').children().attr('id') === "selectView") {
						$('#selectBox2').empty();
					}
					if (dataText === "Graduation, Retention, and Loss Rates") {
						$('#selectBox1').empty();
						changeData("1");
						if (c2State === 2) {
							styleBox();
							modalSelect();
						}
						showContent();
					} else if (dataText === "All Persistence Rates") {
						$('#selectData1>option:eq(1)').prop('selected', true);
						year = $('#selectYear1 option:selected').val();
						showContent();
					} else {
						makeYears("1");
						$('#selectData1>option:eq(1)').prop('selected', true);
						showContent();
					}
				}

				function checkChartTwo() {
					chart = ".chart2", state = 3;
					if (data2Text === "Graduation, Retention, and Loss Rates") {
						changeData("2");
						var boxElem = (c1State === 2) ? (styleBox(), modalSelect()) : ($('#selectBox2').empty(), showContent());
					} else if (data2Text === "All Persistence Rates") {
						$('#selectData2>option:eq(1)').prop('selected', true);
						year2 = $('#selectYear2 option:selected').val();
						showContent();
					} else {
						makeYears("2");
						$('#selectData2>option:eq(1)').prop('selected', true);
						showContent();
					}
				}

				var check = (thisChart === "chart") ? checkChart() : checkChartTwo();

				function showContent() {
					dataText = $('#selectData1 option:selected').text();
					data2Text = $('#selectData2 option:selected').text();
					dataVal = $('#selectData1 option:selected').val();
					data2Val = $('#selectData2 option:selected').val();
					major = $('#selectMajor1 option:selected').val();
					major2 = $('#selectMajor2 option:selected').val();
					collegeText = $('#selectCollege1 option:selected').val();
					college2Text = $('#selectCollege2 option:selected').val();
					csvpath = ("./data/" + collegeText + ".csv");
					csvpath2 = ("./data/" + college2Text + ".csv");

					showChart("clicked", chart, dataVal, data2Val, csvpath, csvpath2, dataText, data2Text, major, major2, year, year2, collegeText, college2Text, state, chart2State, styleBox);
				}

			});

			var top, h, vertical = d3.select(thisChart).append("div").attr("class", "remove").style("position", "absolute").style("z-index", "19").style("width", "1px").style("height", "380px").style("top", "100px").style("bottom", "150px").style("left", "0px").style("background", "#fff");

			if (c2State === 0) {
				top = 220;
				h = 380;
			} else {
				if ($('.title').height() > 30) {
					top = 270;
					h = 885;
				} else {
					top = 230;
					h = 900;
				}
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
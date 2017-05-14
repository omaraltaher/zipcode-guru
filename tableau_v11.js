
// define global variables
var workbook;
var activeSheet;
var viz;
var selected_dataset;

// activates the tableau dashboard, don't change!

function initViz() {

    var vizDiv = document.getElementById("tableau"),
    url = "https://public.tableau.com/views/zipcodeguru/DashboardCA",
    options = {
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: function() {
            workbook = viz.getWorkbook();
            activeSheet = viz.getWorkbook().getActiveSheet();
            getVizData();
            listenToParameter();
        }
    };

  viz = new tableau.Viz(vizDiv, url, options);

  d3 = d3_v4;

}


// prints underlying data to console for now
// eventually need to get the data into d3 somehow

function getVizData() {
    options = {
        maxrows: 0, //0 means all rows
        ignoreAliases: false,
        ignoreSelection: true,
        includeAllColumns: false
    };

    activeSheet.getWorksheets().get("CA2").getUnderlyingDataAsync().then(function (t) {
        var data = t.getData();
        var columns = t.getColumns();
        console.log(t);
        var niceData = reduceToObjects(columns, data);
    });
}


// convert to field:values convention
// not in use currently, but this could make data pretty
function reduceToObjects(cols,data) {
  var fieldNameMap = $.map(cols, function(col) { return col.$impl.$fieldName; });
  var dataToReturn = $.map(data, function(d) {
    return d.reduce(function(memo, value, idx) {
      memo[fieldNameMap[idx]] = value.formattedValue; return memo;
    }, {});
  });
  return dataToReturn;
}


// create a function to filter values
function filterSingleValue() {
    activeSheet.getWorksheets().get("CA2").applyFilterAsync(
    "ZIP Code",
    "96056", // make this manually editable to whatever the user selects
    tableau.FilterUpdateType.REPLACE);
}



// add event listeners here - read documentation on different event listeners
// (what we want to listen to, function to happen)


// LISTENING TO PARAMETER SELECTION: selecting data source

function listenToParameter() {
    viz.addEventListener(tableau.TableauEventName.PARAMETER_VALUE_CHANGE, onParmChange);
}

function onParmChange(parmEvent) {

    console.log(parmEvent.getViz().getWorkbook().getParametersAsync());

    parmEvent.getViz().getWorkbook().getParametersAsync().then(function(parm){
        for(var i=0; i < parm.length;i++) {
            if (parm[i].getName()=="Choose Dataset") {
                console.log(parm);
                console.log(parm[i].getCurrentValue().formattedValue);
                var selected_dataset = parm[i].getCurrentValue().formattedValue;

                if (selected_dataset == "UFO Reports") {
                    d3 = d3_v4;
                    console.log("D3 version 4 called");
                    var empty = "";
                    var infoDiv = document.getElementById('d3Viz');
                    infoDiv.innerHTML = empty;
                    viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection_IRS);
                    console.log("Selected Dataset is UFO Reports, adding event listener to draw graph");
                    viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection_UFO);

                } else if (selected_dataset == "IRS") {
                    d3 = d3_v3;
                    console.log("D3 version 3 called");
                    var empty = "";
                    var infoDiv = document.getElementById('d3Viz');
                    infoDiv.innerHTML = empty;
                    d3.select("svg").remove();
                    d3.select("svg2").remove();
                    viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection_UFO);
                    console.log("Selected Dataset is IRS Data, adding event listener to draw graph");
                    viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection_IRS);

                } else {
                    d3 = d3_v4;
                    d3.select("svg").remove();
                    d3.select("svg2").remove();
                    console.log("Selected dataset is not prepared for interaction yet");

                    // HTML TITLE
                    var datatext = "";
                    datatext += "<br/>You're looking at " + selected_dataset + "</li>";
                    datatext += "<br/>Sorry, there is no interactive data available yet. Come back later!</li>";
                    datatext += "</ul>";

                    var infoDiv = document.getElementById('d3Viz');
                    infoDiv.innerHTML = datatext;

                    viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection_UFO),
                    viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection_IRS);

                };
            }
        }
    });
}


// LISTENING TO ZIP SELECTION, PRINTING DATA


// ON MARKS SELECTION, RUN FUNCTION FOR EACH DATASET
function onMarksSelection_UFO(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks_UFO);
}

function onMarksSelection_IRS(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks_IRS);
}

function onMarksSelection_CO2(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks_CO2);
}

function onMarksSelection_HotAir(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks_HotAir);
}

function onMarksSelection_Pop(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks_Pop);
}



// DIFFERENT D3 GRAPHS FOR EACH DATASET

// HOT AIR BALLOONS
function reportSelectedMarks_HotAir(marksEvent) {
    d3.select("svg").remove();
    d3.select("svg2").remove();

    // HTML TITLE
    var datatext = "";
    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        var zip_value = pairs[2].formattedValue;
        var city_value = pairs[7].formattedValue;
        datatext += "<br/>You're looking at Hot Air Balloon Data</li>";
        datatext += "<br/>You've selected zip: " + zip_value + "</li>";
        datatext += "<br/>and city: " + city_value + "</li>";
        datatext += "<br/><b>Interactive Data Coming Soon</b></li>";
        datatext += "</ul>";
    }

    var infoDiv = document.getElementById('d3Viz');
    infoDiv.innerHTML = datatext;
}

// POPULATION
function reportSelectedMarks_Pop(marksEvent) {
    d3.select("svg").remove();
    d3.select("svg2").remove();

    // HTML TITLE
    var datatext = "";
    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        var zip_value = pairs[2].formattedValue;
        var city_value = pairs[7].formattedValue;
        datatext += "<br/>You're looking at Population Data</li>";
        datatext += "<br/>You've selected zip: " + zip_value + "</li>";
        datatext += "<br/>and city: " + city_value + "</li>";
        datatext += "<br/><b>Interactive Data Coming Soon</b></li>";
        datatext += "</ul>";
    }

    var infoDiv = document.getElementById('d3Viz');
    infoDiv.innerHTML = datatext;
}


// CO2 EMISSIONS
function reportSelectedMarks_CO2(marks) {


    d3.select("svg").remove();
    d3.select("svg2").remove();

    // HTML TITLE
    var datatext = "";
    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        var zip_value = pairs[2].formattedValue;
        var city_value = pairs[7].formattedValue;
        datatext += "<br/>You're looking at CO2 Emissions</li>";
        datatext += "<br/>You've selected zip: " + zip_value + "</li>";
        datatext += "<br/>and city: " + city_value + "</li>";
        datatext += "</ul>";
    }

    var infoDiv = document.getElementById('d3Viz');
    infoDiv.innerHTML = datatext;

    // START D3
    var margin = {top: 20, right: 50, bottom: 90, left: 60};
    var w = 400 - margin.left - margin.right;
    var h = 400 - margin.top - margin.bottom;
    var barPadding = 2;


    d3.csv("/datasets/09_CO2_emissions/CO2_by_ZIP_2013_CA.csv", function (dataset) {
        var data = dataset.filter(function(d) {return d.ZipCode == zip_value});
        var colNames = d3.keys(dataset[0]);
        console.log(data);
        console.log(colNames);

        var svg = d3.select("#d3Viz")
                    .append("svg")
                    .attr("width", w + margin.left + margin.right)
                    .attr("height", h + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate("+margin.left + "," + margin.top + ")");
        /*
        var yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) {return d.total_tCO2e_yr;})])
                    .range([h, 0]);

        var xScale = d3.scaleBand()
                        .domain(colNames)
                        .rangeRound([0, w]);
        */

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .filter(function(d) {return d.ZipCode})
            .attr("x", function(d, i) {
                return (i * (w) / (colNames.length));
            })
            .attr("y", function(d) {
                return d.total_tCO2e_yr;
            })
            .attr("width", ( (w - margin.left - margin.right) / (d3.selectAll(data).size()) ) - barPadding)
            .attr("height", function(d) {
                return h - d.total_tCO2e_yr;
            })
            .attr("fill", "orange")
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("fill","red")
                })

            .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill","orange");
            })
            ;
    });
}

function reportSelectedMarks_UFO(marks) {

    d3.select("svg").remove();
    d3.select("svg2").remove();

    // HTML TITLE
    var datatext = "";
    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        var zip_value = pairs[2].formattedValue;
        var city_value = pairs[7].formattedValue;
        datatext += "<br/>You're looking at UFO data</li>";
        datatext += "<br/>You've selected zip: " + zip_value + "</li>";
        datatext += "<br/>and city: " + city_value + "</li>";
        datatext += "</ul>";
    }

    var infoDiv = document.getElementById('d3Viz');
    infoDiv.innerHTML = datatext;

    // START D3
    var margin = {top: 20, right: 50, bottom: 90, left: 60};
    var w = 400 - margin.left - margin.right;
    var h = 400 - margin.top - margin.bottom;
    var barPadding = 2;

d3.csv("sum_by_city_clean.csv", function (dataset) { d3.csv("every_report_by_city_CLEAN.csv", function (dataset2) { d3.csv("reports_by_date.csv", function (d) {
    d.Date = parseTime(d.Date);
    d.Total = +d.Total;
   return d;
 }, function(dataset3) {

        dataset.sort(function(a,b) {return d3.descending(+a.Reports, +b.Reports);});

        // dataset2.sort(function(c,d) {return d3.descending(+c.Date, +d.Date);});

        var inputCity = city_value

        var header = d3.select("h1")
                        .append("text")
                        .style('fill', 'teal')
                        .text(inputCity + ", CA")

        var filteredData = dataset.filter(function(d) {return d.City == inputCity})

        var filteredData2 = dataset2.filter(function(d) {return d.USPS_city == inputCity})

        // var filteredData3 = dataset3.filter(function(d) {return d.City == inputCity})

        var UFO_type = []

        filteredData.map(function(d) {
                            UFO_type.push(d.UFO_type);})


        var yScale = d3.scaleLinear()
                    .domain([0, d3.max(filteredData, function(d) {return d.Reports;})]) //need to pull 6 form data
                    .range([h, 0]);

        var xScale = d3.scaleBand()
                        .domain(UFO_type)
                        .rangeRound([0, w]);

        var svg = d3.select("#d3Viz")
                    .append("svg")
                    .attr("width", w + margin.left + margin.right)
                    .attr("height", h + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate("+margin.left + "," + margin.top + ")");

        var svg2 = d3.select("#d3Viz2")
                    .append("svg2");
                    // .attr("width", w + margin.left + margin.right)
                    // .attr("height", h + margin.top + margin.bottom)
                    // .append("g");
                    // .attr("transform", "translate("+margin.left + "," + margin.top + ")");;

        // var svg3 = d3.select("#chart3")
        //             .append("svg3");
                    // .attr("width", w + margin.left + margin.right)
                    // .attr("height", h + margin.top + margin.bottom)
                    // .append("g3");
                    // .attr("transform", "translate("+margin.left + "," + margin.top + ")");


        svg.selectAll("rect")
        .data(filteredData)
        .enter()
        .append("rect")
        .filter(function(d) {return d.City})
        .attr("x", function(d, i) {
            return (i * (w) / (d3.selectAll(filteredData).size()))
        })
        .attr("y", function(d) {
            return yScale(d.Reports);
        })
        .attr("width", ( (w - margin.left - margin.right) / (d3.selectAll(filteredData).size()) ) - barPadding)
        .attr("height", function(d) {
            return h - yScale(d.Reports);
        })
        .attr("fill", "orange")
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("fill","red")
            })

        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill","orange");
        })
        ;


        var xAxis = d3.axisBottom(xScale)
            .tickValues(xScale.domain())
            .ticks(10);

        var yAxis = d3.axisLeft(yScale)
            .ticks(5);


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)
          .selectAll("text")
            .attr("transform" , "rotate(-80)")
            .style("text-anchor", "end")
            .attr("font-size",12)
            .attr("font","HelveticaNeue-Light")
            .attr("y", function(d,i) {
                return -17 + i*barPadding/2.7;
            })
            .attr("x", -10)
            .attr("fill", "black");

        svg.append("text")      // text label for the x axis
                .attr("x", w/2 )
                .attr("y",  h + margin.top + 68 )
                .style("text-anchor", "middle")
                .style("font-size", 14)
                .text("Type of UFO");

        svg.append("g")
            .attr("class", "axis")
            .call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", - 45)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Reports");

        var ufoReport = svg2.selectAll("text")
                            .data(filteredData2)
                            .enter()
                            .append("text")
                            .html(function(d,i) {
                             return "Date: " + d.Date + "<br> "+ "Duration: " + d.Duration + "<br>" + "UFO type: " + d.UFO_type + "<br>" + d.Summary + "<br>" + "<br>"
                             })
                            .attr("font","sans-serif")
                            ;
  });
});
});

}







function reportSelectedMarks_IRS(marks) {
    d3 = d3_v3;

    d3.select("svg").remove();
    d3.select("svg2").remove();

    // HTML TITLE
    var datatext = ""; 
    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        var zip_value = pairs[2].formattedValue;
        var city_value = pairs[7].formattedValue;
        datatext += "<br/>You're looking at IRS DATA";
        datatext += "<br/>You've selected zip: " + zip_value + "</li>";
        datatext += "<br/>and city: " + city_value + "</li>";
        datatext += "</ul>";
    }

    var infoDiv = document.getElementById('d3Viz3');
    infoDiv.innerHTML = datatext;

    // START D3

    var zip_value = zip_value;
   // var margin = {top: 20, right: 200, bottom: 100, left: 50},
    //margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
   // width = 400 - margin.left - margin.right,
   // height = 480 - margin.top - margin.bottom;
    //height2 = 500 - margin2.top - margin2.bottom;

    var margin = {top: 20, right: 50, bottom: 90, left: 60};
    var width = 400 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    
    //var parseDate = d3.time.format("%Y%m%d").parse;
    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    // 40 Custom colors 
    var color = d3.scale.ordinal().range(["#48A36D",  "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF","#ff8c00","#d0743c","#a05d56", "#6b486b","#7b6888","#8a89a6", "#98abc5", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");    

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format(".2s"));  

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.returnCateg); })
        .defined(function(d) { return d.returnCateg; });  // Hiding line value defaults of 0 for missing data

    var maxY; // Defined later to update yAxis

  

    var chart1 = d3.select("#d3Viz3").append("svg")
        .attr("width", width + margin.left + margin.right + 400)
        .attr("height", height + margin.top + margin.bottom + 400) //height + margin.top + margin.bottom
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         

    // Create invisible rect for mouse tracking
    chart1.append("rect")
        .attr("width", width)
        .attr("height", height)                                    
        .attr("x", 0) 
        .attr("y", 0)
        .attr("id", "mouse-tracker")
        .style("fill", "white"); 


      
      d3.csv("ca_clean_amount_merged.csv", function(error, data) { 
      var Zipcode = zip_value
      var data = data.filter(function(d) {return d.ZIP == Zipcode})
      
      d3.keys(data[0]).filter(function(key) { return key !== "date" && key !== "ZIP" ; });

      color.domain(d3.keys(data[0]).filter(function(key) { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an returnCount
      return key !=="ZIP" && key !== "date";
       }));
     
     
     
        var categories = color.domain().map(function(name) { // Nest the data into an array of objects with new keys

        return {
          name: name, // "name": the csv headers except date
          values: data.map(function(d) { // "values": which has an array of the dates and ratings
            return {
              date: d.date, 
              returnCateg: +(d[name]),
              };
          }),
          visible: (name === "Unemployment compensation Amount" ? true : false) // "visible": all false except for economy which is true.
        };
      });
      
      

      //yScale.domain([0, 1000]);
        maxY = findMaxY(categories);
        yScale.domain([0,maxY])
      
      xScale.domain(data.map(function(d) { return d.date; }));
     // yScale.domain([0, d3.max(data, function(d) { return d.returnCateg; })]); 
      
      
      
      // draw line graph
      chart1.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          //.attr("transform", "rotate(-90)")
          .attr("y", 30)
          .attr("x", 150)
          .attr("dy", ".91em")
          .style("text-anchor", "middle")
          .text("Years");
          
         //.style("text-anchor", "middle")
         //.text("Number of Reports");

      chart1.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -50)
          .attr("x", -80)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Counts - Returns Filed");


      var returnCount = chart1.selectAll(".returnCount")
          .data(categories) // Select nested data and append to new svg group elements
        .enter().append("g")
          .attr("class", "returnCount");   

      returnCount.append("path")
          .attr("class", "line")
          .style("pointer-events", "none") // Stop line interferring with cursor
          .attr("id", function(d) {
            return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert returnCount name, with any spaces replaced with no spaces)
          })
          .attr("d", function(d) { 
            return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
          })
         .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
          .style("stroke", function(d) { return color(d.name); });


          
      // draw legend
      var legendSpace = 450 / categories.length; // 450/number of issues (ex. 40)    

      returnCount.append("rect")
          .attr("width", 10)
          .attr("height", 10)                                    
          .attr("x", width + (margin.right/3) - 15) 
          .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
          .attr("fill",function(d) {
            return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
          })
          .attr("class", "legend-box")

          .on("click", function(d){ // On click make d.visible 
            d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
            
      
      

            maxY = findMaxY(categories); // Find max Y returnCateg value categories data with "visible"; true
            yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
            chart1.select(".y.axis")
              .transition()
              .call(yAxis);   

            returnCount.select("path")
              .transition()
              .attr("d", function(d){
                return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
              })

            returnCount.select("rect")
              .transition()
              .attr("fill", function(d) {
              return d.visible ? color(d.name) : "#F1F1F2";
            });
          })
          
          
         .on("mouseover", function(d){

            d3.select(this)
              .transition()
              .attr("fill", function(d) { return color(d.name); });

            d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
              .transition()
              .style("stroke-width", 2.5);  
            
           div.transition()     
                    .duration(200)      
                    .style("opacity", .9);      
        
            div.html(formatTime(d.date)+ " "+ d.values);
                //.style("left", (d3.event.pageX) + "px")   ;   

                    
          })

          .on("mouseout", function(d){

            d3.select(this)
              .transition()
              .attr("fill", function(d) {
              return d.visible ? color(d.name) : "#F1F1F2";});

            d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
              .transition()
              .style("stroke-width", 1.5);
          })
          
      returnCount.append("text")
          .attr("x", width + (margin.right/3)) 
          .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })   
          .text(function(d) { return d.name; }); 
    
      // Hover line 
      var hoverLineGroup = chart1.append("g") 
                .attr("class", "hover-line");
                

      var hoverLine = hoverLineGroup // Create line with basic attributes
            .append("line")
                .attr("id", "hover-line")
                .attr("x1", 10).attr("x2", 10) 
                .attr("y1", 0).attr("y2", height + 10)
                //.style("pointer-events", "none") // Stop line interferring with cursor
               .style("opacity", 1e-6); // Set opacity to zero 

       
               
      var hoverDate = hoverLineGroup
            .append('text')
                .attr("class", "hover-text")
                .attr("y", height - (height-40)) // hover date text position
                .attr("x", width - 150) // hover date text position
                .style("fill", "#E6E7E8");

        
                
      var columnNames = d3.keys(data[0]) //grab the key values from your first data row
                                         //these are the same as your column names
                      .slice(2); //remove the first column name ('date', 'zip');
                      
       var focus = returnCount.select("g") 
          .data(columnNames) // bind each column name date to each g element
        .enter().append("g") //create one <g> for each columnName
          .attr("class", "focus"); 

       focus.append("text") 
            .attr("class", "tooltip")
            .attr("x", width + 20)   
            .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); });        

      // Add mouseover events for hover line.
      d3.select("#mouse-tracker") 
      .on("mousemove", mousemove) 
      .on("mouseout", function() {
          hoverDate
          .text(null) 

          d3.select("#hover-line")
              .style("opacity", 1e-6); // On mouse out making line invisible
      });

      function mousemove() { 
          var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
          var graph_x = xScale.invert(mouse_x); // 

          
          var format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year
          
          hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year
          
          d3.select("#hover-line") // select hover-line and changing attributes to mouse position
              .attr("x1", mouse_x) 
              .attr("x2", mouse_x)
              .style("opacity", 1); // Making line visible

          
          var x0 = xScale.invert(d3.mouse(this)[0]), 
          i = bisectDate(data, x0, 1), 
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
          
          focus.select("text").text(function(columnName){
           
             return (d[columnName]);
          });
      }; 

     
    }); // End Data callback function

}
     
function findMaxY(tt){  // Define function "findMaxY"
var maxYValues = tt.map(function(d) { 
  if (d.visible){
    return d3.max(d.values, function(value) { // Return max returnCateg value
      return value.returnCateg; })
  }
});
return d3.max(maxYValues);
}


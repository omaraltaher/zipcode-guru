
var hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
var dataset = [16,17,3,0,0,0,0,7,1,10,14,16,0,5,13,18,5,8,0,0,14,16,18,3];

var margin = {top: 10, right: 20, bottom: 10, left: 30};

var w = 600 - margin.left - margin.right;
var h = 400 - margin.top - margin.bottom;
var barPad = 2;

var svg = d3.select("#d3Viz")
            .append("svg")
            .attr("width",w + margin.left + margin.right)
            .attr("height",h + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate("+margin.left+","+margin.top+")");

	svg.selectAll("rect")
	    .data(dataset)
	    .enter()
	    .append("rect")
	    .attr("x",function(d, i) {return i * (w / dataset.length);})
	    .attr("y",function(d) {return h-(d*15)-7;})
	    .attr("width", w / dataset.length - barPad)
	    .attr("height", function(d,i) {return d*15-7;})
	    .attr("fill", function(d) {
	            return "rgb(0, 30, " + (200 - d * 6) + ")";
	       });

	svg.selectAll("text.value")
	   .data(dataset)
	   .enter()
	   .append("text")
	   .text(function(d) {
	        return d;
	   })
	   .attr("text-anchor", "middle")
	   .attr("x", function(d, i) {
	        return i * (w / dataset.length) + (w / dataset.length - barPad) / 2;
	   })
	   .attr("y", function(d) {
	        return h - (d * 15) + 4;
	   })
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "11px")
	   .attr("fill", "white")
	   .attr("class","value");

	svg.selectAll("text.axis")
	   .data(hours)
	   .enter()
	   .append("text")
	   .text(function(d) {
	        return d;
	   })
	   .attr("text-anchor", "middle")
	   .attr("x", function(d, i) {
	        return i * (w / dataset.length) + (w / dataset.length - barPad) / 2;
	   })
	   .attr("y", function(d) {
	        return h;
	   })
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "11px")
	   .attr("fill", "black")
	   .attr("class","axis");

	svg.append("text")
	    .attr("x", w/2)
	    .attr("y", 30)
	    .attr("text-anchor","middle")
	    .text("Nikki's Spotify Listening on Tuesday Feb 8 by Hour")
	    .attr("font-family", "sans-serif")
	    .attr("font-size", "20px");

	svg.append("text")
	    .attr("x", -50)
	    .attr("y", h/2-35)
	    .attr("text-anchor","middle")
	    .attr("transform", "rotate(-90,20,"+h/2+")")
	    .text("Number of Songs")
	    .attr("font-family", "sans-serif")
	    .attr("font-size", "12px");



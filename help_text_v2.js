var counter_help_text_display = 1;
var counter_help_img = 0;

var help_images = {"h0": "01_zipcode_land.png",
				   "h1": "02_search_box.png", 
				   "h2": "03_zoom_in.png", 
				   "h3": "04_zoom_out.png", 
				   "h4": "05_zoom_home.png", 
				   "h5": "06_select_data_set.png", 
				   "h6": "07_data_timeline.png",
				   "h7": "08_data_choose_series.png" 
				}


function showHelp(){

	counter_help_text_display ++;

	if ((counter_help_text_display % 2) == 0){
		d3.select("#help_container").classed("hidden", false);
		d3.select("#help_show_hide").text("All done getting help!");
		d3.select("#d3Viz").classed("hidden", true);
		d3.select("#d3Viz2").classed("hidden", true);
		d3.select("#d3Viz3").classed("hidden", true);
	}
	else{
		d3.select("#help_container").classed("hidden", true);
		d3.select("#help_show_hide").text("Click me to find out how to use this website?");
		d3.select("#d3Viz").classed("hidden", false);
		d3.select("#d3Viz2").classed("hidden", false);
		d3.select("#d3Viz3").classed("hidden", false);
		counter_help_text_display = 1;
	}
}
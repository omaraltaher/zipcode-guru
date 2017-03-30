
// define global variables
var workbook;
var activeSheet;

function initViz() {
    var containerDiv = document.getElementById("vizContainer"),
        url = "https://public.tableau.com/views/BirthDeathPOC/Dashboard2?:embed=y&:display_count=yes",
        options = {
            hideTabs: true,
            onFirstInteractive: function () {
                // console.log("Run this code when the viz has finished loading.");
                workbook = viz.getWorkbook();
                activeSheet = workbook.getActiveSheet();
            }
        };

    var viz = new tableau.Viz(containerDiv, url, options);

    // add event listeners here - read documentation on different event listeners
    // (what we want to listen to, function to happen)
    viz.addEventListener('marksselection', function() {alert('Marks have been selected');})

}

function filterSingleValue() {
	activeSheet.getWorksheets().get("CA").applyFilterAsync(
    "ZIP Code",
    "96056",
    tableau.FilterUpdateType.REPLACE);
}      
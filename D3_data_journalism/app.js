// Set up scatterplot
// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

    // If the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // Clear SVG if not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    };

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    // Margins
    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // Chart area minus margins
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Create SVG container
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Shift everything over by the margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import data from CSV
    d3.csv("data.csv").then(function(censusData) {
        console.log(censusData);

        // Cast data
        censusData.forEach(function(data) {
            data.state = +data.state;
            data.abbr = +data.abbr;
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMoe;
            data.age = +data.age;
            data.ageMoe = +data.ageMoe;
            data.income = +data.income;
            data.incomeMoe = +data.incomeMoe;
            data.healthcare = +data.healthcare;
            data.healthcareLow = +data.healthcareLow;
            data.healthcareHigh = +data.healthcareHigh;
            data.obesity = +data.obesity;
            data.obesityLow = +data.obesityLow;
            data.obesityHigh = +data.obesityHigh;
            data.smokes = +data.smokes;
            data.smokesLow = +data.smokesLow;
            data.smokesHigh = +data.smokesHigh;
        })
        console.log(censusData);

        // Create x, y scales
        var xScale = d3.scaleLinear()
            .domain([7, d3.max(censusData, d => d.poverty)])
            .range([0, width]);
        console.log(xScale);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(censusData, d => d.healthcare)])
            .range([height, 0]);
        console.log(yScale);

        // Create x, y axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // Set axes to the bottom of scatterplot
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

        // Create circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "10")
            .attr("fill", "blue");

        // Create text labels
        var states = chartGroup.selectAll("text")
            .data(censusData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare));

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", `translate(${width /2}, ${height + margin.top + 37})`)
            .attr("text-anchor", "middle")
            .classed("axis-text", true)
            .text("In Poverty (%)");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Lacks Healthcare (%)");

        // Initalize tooltip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>In Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`);
            });
        
        // Create the tooltip in chartGroup
        chartGroup.call(toolTip);

        // Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
        })

        // Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
                toolTip.hide(d);
        }).catch(function(error) {
            console.log(error);
        });
    });
};

// When the browser loads, makeResponsive() is called
makeResponsive();

// When the browser window is resized, makeResponsive() is called
d3.select(window).on("resize", makeResponsive);

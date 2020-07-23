// Set up scatterplot
var svgWidth = 960;
var svgHeight = 500;

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
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
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
        .attr("fill", "lightblue")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

    // Create text labels
    var states = chartGroup.selectAll(".text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("dy", ".3em")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare));

    // Create axes labels
    var xLabels = chartGroup.append("text")
        .attr("transform", `translate(${width /2}, ${height + 35})`)
        .attr("text-anchor", "middle")
        .classed("axis-text", true)
        .text("In Poverty (%)");

    var yLabels = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");
});

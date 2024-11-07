let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

const w = 800;
const h = 600;
const p = 40;
let dataArray = [];
let yScale;
let xScale;
let xAxisScale;
let yAxisScale;
let svg = d3.select('svg');

let drawCanvas = () => {
    svg.attr("width", w)
       .attr("height", h)
}

let generateScales = () => {
    yScale = d3.scaleLinear()
                          .domain([0,d3.max(dataArray, (d) => d[1])])
                          .range([0, h - (2 * p)])
    
    xScale = d3.scaleLinear()
                     .domain([0, dataArray.length - 1])
                     .range([p, w - p])
    
    let datesArray = dataArray.map((d) => {
        return new Date(d[0])
    })


    xAxisScale = d3.scaleTime()
                   .domain([d3.min(datesArray), d3.max(datesArray)])
                   .range([p, w - p])
    
    yAxisScale = d3.scaleLinear()
                         .domain([0, d3.max(dataArray, (d) => {
                            return d[1]
                         })])
                         .range([(h - p), p])
}

let drawBars = () => {

    let toolTip = d3.select("body")
       .append("div")
       .attr("id", "tooltip")
       .style("visibility", "hidden")
       .style("width", "auto")
       .style("height", "auto")
       .style("position", "absolute")
       
 
    svg.selectAll("rect")
       .data(dataArray)
       .enter()
       .append("rect")
       .attr("width", (w - 2 * p) / dataArray.length)
       .attr("height", (d) => yScale(d[1]))
       .attr("x", (d, i) => xScale(i))
       .attr("y", (d, i) => h - p - yScale(d[1]))
       .attr("class", "bar")
       .attr("fill", "#579ec9")
       .attr("data-date", (d) => d[0])
       .attr("data-gdp", (d) => d[1])
       .on("mouseover", (d) => {
        toolTip.transition()
          .style("visibility", "visible")
        toolTip.html(`${d[0]} <br /><strong>$${d[1]} Billion</strong>`)
        document.querySelector('#tooltip').setAttribute('data-date', d[0])
      })
      .on('mouseout', (d) => {
        toolTip.transition()
            .style('visibility', 'hidden')
    }) 

}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - p})`)
    
    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
       .call(yAxis)
       .attr("id", "y-axis")
       .attr("transform", `translate(${p}, 0)`)
}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    dataArray = data.data;
    
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()
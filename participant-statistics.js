(function() {
    const data = [
        {
            name: 'Maurits',
            Losses: 4,
            Podiums: 2,
            Wins: 0
        },
        {
            name: 'Brian',
            Losses: 3,
            Podiums: 1,
            Wins: 0
        },
        {
            name: 'Alex',
            Losses: 0,
            Podiums: 1,
            Wins: 1
        },
        {
            name: 'Fabian',
            Losses: 3,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Christian Johan',
            Losses: 3,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Kristian',
            Losses: 3,
            Podiums: 3,
            Wins: 1
        },
        {
            name: 'Johan',
            Losses: 1,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Oliver',
            Losses: 2,
            Podiums: 1,
            Wins: 1
        },
        {
            name: 'Magnus',
            Losses: 3,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Martin',
            Losses: 3,
            Podiums: 1,
            Wins: 1
        }
    ];

    const columns = [
        "name",
        "Losses",
        "Podiums",
        "Wins"
    ];

    const groupKey = columns[0];

    const keys = columns.slice(1);

    const margin = ({top: 40, right: 10, bottom: 40, left: 111});

    const height = data.length * 25 + margin.top + margin.bottom;
    const width = 500;

    const series = d3.stack()
        .keys(columns.slice(1))(data)
        .map(d => (d.forEach(v => v.key = d.key), d));

    const x = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.08);

    const color = {
        Wins: "#66c2a5",
        Podiums: "#8da0cb",
        Losses: "#fc8d62"
    };

    const xAxis = (g) => {
        g.attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 100, "s"))
            .call(g => g.selectAll(".domain").remove());
        }

    const yAxis = (g) => {
            g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).tickSizeOuter(0))
                .call(g => g.selectAll(".domain").remove());
        }

    const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en");

    const chart = (data) => {
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.selectAll("mydots")
          .data(keys)
          .enter()
          .append("circle")
            .attr("cx", function(d,i){ return 130 + i * 100 })
            .attr("cy", function(d,i){ return 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return color[d]})

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
          .data(keys)
          .enter()
          .append("text")
            .attr("x", function(d,i){ return 140 + i * 100 })
            .attr("y", function(d,i){ return 27}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color[d]})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
                .attr("fill", d => color[d.key])
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("x", d => x(d[0]))
                .attr("y", (d, i) => y(d.data.name))
                .attr("width", d => x(d[1]) - x(d[0]))
                .attr("height", y.bandwidth())
            .append("title")
            .text(d => `${d.data.name} ${d.key}: ${formatValue(d.data[d.key])}`);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        return svg.node();
    }

    window.addEventListener('load', function() {
        document.querySelector('#js-participant-statistics').appendChild(chart(data));
    });
})();

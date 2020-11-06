(function() {
    const data = [
        {
            name: 'Maurits',
            Losses: 2,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Brian',
            Losses: 2,
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
            Losses: 2,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Christian Johan',
            Losses: 2,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Kristian',
            Losses: 0,
            Podiums: 2,
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
            Losses: 1,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Magnus',
            Losses: 2,
            Podiums: 0,
            Wins: 0
        },
        {
            name: 'Martin',
            Losses: 2,
            Podiums: 0,
            Wins: 0
        }
    ];

    const columns = [
        "name",
        "Wins",
        "Podiums",
        "Losses"
    ];

    groupKey = columns[0];

    keys = columns.slice(1)

    const height = 700;
    const width = 500;

    margin = ({top: 10, right: 150, bottom: 20, left: 40});

    legend = (svg) => {
      const g = svg
          .attr("transform", `translate(${width},0)`)
          .attr("text-anchor", "end")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .join("g")
          .attr("transform", (d, i) => `translate(0,${i * 20})`);

      g.append("rect")
          .attr("x", -19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", color);

      g.append("text")
          .attr("x", -24)
          .attr("y", 9.5)
          .attr("dy", "0.35em")
          .text(d => d);
    }

    const y0 = d3.scaleBand()
        .domain(data.map(d => d[groupKey]))
        .rangeRound([margin.top, height - margin.bottom])
        .paddingInner(0.1);

    const y1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([y0.bandwidth(), 0])
        .padding(0.05);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
        .rangeRound([margin.left, width - margin.right])

    const color = d3.scaleOrdinal()
        .range(["#4caf50", "#ff9800", "#f44336"]);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(d3.axisBottom(x).ticks(3, "s"))
        .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 15)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y));

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y0).ticks(null, "s"))
        .call(g => g.select(".domain").remove())

    const chart = (data) => {
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("font", "10px sans-serif");

        svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
          .attr("transform", d => `translate(0,${y0(d[groupKey])})`)
        .selectAll("rect")
        .data(d => keys.map(key => ({key, value: d[key]})))
        .join("rect")
          .attr("x", d => x(0))
          .attr("y", d => y1(d.key))
          .attr("height", y1.bandwidth())
          .attr("width", d => x(d.value) - x(0))
          .attr("fill", d => color(d.key));

        svg.append("g")
          .call(xAxis);

        svg.append("g")
          .call(yAxis);

        svg.append("g")
          .call(legend);

        return svg.node();
    }

    window.addEventListener('load', function() {
        document.querySelector('#js-participant-statistics').appendChild(chart(data));
    });
})();

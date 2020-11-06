
// Data mangler:
// Olis rom
// Fritz tequila (men han kan ikke huske hvilken)
// Manis Cachaça
const data = {
    name: 'HaneHale Ingredient Statistics',
    children: [
        {
            name: 'Spirits',
            children: [
                {
                    name: 'Brandy',
                    children: []
                },
                {
                    name: 'Gin',
                    children: [
                        {
                            name: 'Tanqueray',
                            value: 1
                        }
                    ]
                },
                {
                    name: 'Rum',
                    children: [
                        {
                            name: 'Ron Palma Mulata 7 Anejo',
                            value: 1
                        },
                        {
                            name: 'Bacardi Spiced',
                            value: 1
                        }
                    ]
                },
                {
                    name: 'Tequila',
                    children: []
                },
                {
                    name: 'Vodka',
                    children: [
                        {
                            name: 'Absolut',
                            value: 1
                        }
                    ]
                },
                {
                    name: 'Whiskey',
                    children: []
                },
                {
                    name: 'Arrack',
                    children: [{name: 'Batavia', value: 1}]
                },
                {
                    name: 'Sake',
                    children: [
                        {
                            name: 'Yuzu Infused',
                            value: 1
                        }
                    ]
                },
                {
                    name: 'Cachaça',
                    children: []
                }
            ]
        },
        {
            name: 'Garnish',
            children: [
                {
                    name: 'Lime',
                    value: 1
                },
                {
                    name: 'Orange Peel',
                    value: 1
                },
                {
                    name: 'Syringe',
                    value: 1
                },
                {
                    name: 'Shiso Leaves',
                    value: 1
                },
                {
                    name: 'Blackberry',
                    value: 1
                },
                {
                    name: 'Lemon',
                    value: 1
                },
                {
                    name: 'Grapefruit',
                    value: 1
                },
                {
                    name: 'Chili',
                    value: 1
                },
                {
                    name: 'Cinnamon',
                    value: 1
                }
            ]
        },
        {
            name: 'Accents',
            children: [
                {
                    name: 'Liqueurs',
                    children: [
                        {
                            name: 'Yuzu',
                            value: 1
                        },
                        {
                            name: 'Passion Fruit',
                            value: 1
                        },
                        {
                            name: 'Creme De Mure',
                            value: 1
                        },
                        {
                            name: 'Chili',
                            value: 1
                        },
                        {
                            name: 'Kahlua',
                            value: 1
                        },
                        {
                            name: 'Coole Swan',
                            value: 1
                        }
                    ]
                },
                {
                    name: 'Syrups',
                    children: [
                        {
                            name: 'Demerara Sugar',
                            value: 1
                        },
                        {
                            name: 'Vanilla',
                            value: 1
                        },
                        {
                            name: 'Mixed Citrus',
                            value: 1
                        },
                        {
                            name: 'Simple',
                            value: 1
                        },
                        {
                            name: 'Grenadine',
                            value: 1
                        }
                    ]
                },
                {
                    name: 'Soda',
                    chrildren: [
                        {
                            name: 'Ramune',
                            value: 1
                        },
                        {
                            name: 'Grapefruit',
                            value: 1
                        }
                    ]
                },
                {
                    name: 'Miscellaneous',
                    children: [
                        {
                            name: 'Fruit Colouring',
                            children: [
                                {
                                    name: 'Green',
                                    value: 1
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'Modifiers',
            children: [
                {
                    name: 'Bitters',
                    children: [
                        {
                            name:'Campari', value: 1
                        }
                    ]
                },
                {
                    name: 'Fruits',
                    children: [
                        {
                            name: 'Fresh Pineapple Juice',
                            value: 1
                        },
                        {
                            name: 'Fresh Lime Juice',
                            value: 4
                        },
                        {
                            name: 'Raspberry Puree',
                            value: 1
                        },
                        {
                            name: 'Muddled Lemon',
                            value: 1
                        },
                        {
                            name: 'Lemon Juice',
                            value: 1
                        }
                    ]
                }
            ]
        }
    ]
}

width = 500;

radius = width / 6;

color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

format = d3.format(",d")

const chart = (data) => {
  const root = partition(data);

  root.each(d => d.current = d);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "10px sans-serif");

  const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

  const path = g.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("d", d => arc(d.current));

  path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

  path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name);

  const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

  function clicked(event, p) {
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attrTween("d", d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  return svg.node();
}

partition = (data) => {
  const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
  return d3.partition()
      .size([2 * Math.PI, root.height + 1])
    (root);
}

window.addEventListener('load', function() {
    document.querySelector('#js-ingredient-Statistics').appendChild(chart(data));
});

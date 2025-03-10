document.addEventListener("DOMContentLoaded", function() {
  // ---------- Initialize ScrollMagic ----------
  const controller = new ScrollMagic.Controller();
  
  // ---------- Generate Starfield ----------
  function generateStarfield() {
    const starfield = document.getElementById('starfield');
    const numberOfStars = 200; // Adjust this number for star density
    const starfieldWidth = window.innerWidth;
    const starfieldHeight = window.innerHeight * 2; // Make it taller for parallax effect
    const controller = new ScrollMagic.Controller();
    
    // Clear any existing stars first
    starfield.innerHTML = '';
    
    // Create stars
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Randomize star properties
      const size = Math.random() * 3 + 1; // Size between 1-4px
      const x = Math.random() * starfieldWidth;
      const y = Math.random() * starfieldHeight;
      const opacity = Math.random() * 0.5 + 0.1; // Opacity between 0.1-0.6
      
      // Apply star properties
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.opacity = opacity;
      
      // Add to starfield
      starfield.appendChild(star);
    }
  }
  
  // Generate initial starfield
  generateStarfield();
  
  // Regenerate starfield on window resize
  window.addEventListener('resize', generateStarfield);
  
  // ---------- Starfield Parallax Effect ----------
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const stars = document.querySelectorAll('.star');
    
    // Apply different parallax speeds to different stars
    stars.forEach((star, index) => {
      // Create variation in parallax speed for different stars
      const parallaxFactor = 0.2 + (index % 3) * 0.1; // Varies between 0.2, 0.3, and 0.4
      const yPos = scrollPosition * parallaxFactor;
      star.style.transform = `translateY(-${yPos}px)`;
    });
  });
  
  // ---------- Section Fade-In with ScrollMagic ----------
  document.querySelectorAll('.section').forEach(function(section) {
    new ScrollMagic.Scene({
      triggerElement: section,
      triggerHook: 0.85,
      reverse: false
    })
    .setTween(
      gsap.fromTo(
        section.querySelector('.container'),
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
    )
    .addTo(controller);
  });

  // ---------- Horizontal Scroll Section ----------
  // Convert the most-active and nationality sections to horizontal scroll
  const horizontalSections = document.getElementById('horizontal-container');
  
  // Calculate the width of horizontal sections
  const horizontalScrollWidth = horizontalSections.scrollWidth;
  
  // Create scene for horizontal scroll section
  new ScrollMagic.Scene({
    triggerElement: '#horizontal-scroll-trigger',
    duration: horizontalScrollWidth,
    triggerHook: 0,
    offset: 0
  })
  .setPin('#horizontal-scroll-trigger')
  .setTween(
    gsap.to('#horizontal-container', {
      x: -horizontalScrollWidth + window.innerWidth,
      ease: "none"
    })
  )
  .addTo(controller);

  // ================= 1) Timeline of Crewed Missions =================
  d3.json("data/astronauts.json").then(function(data) {
    // Group by year => count
    let missionsByYear = d3.rollup(
      data,
      v => v.length,
      d => +d["Mission.Year"]
    );
    let missionsArray = Array.from(missionsByYear, ([year, count]) => ({ year, count }));
    missionsArray.sort((a, b) => a.year - b.year);

    // Get container width for responsive chart
    let container = document.querySelector("#missions-timeline .container");
    let containerWidth = container.clientWidth - 80; // accounting for padding
    
    let width = containerWidth, height = 250;
    let svg = d3.select("#missions-chart")
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Define gradient for area fill
    let defs = svg.append("defs");
    let gradient = defs.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#1E90FF")
      .attr("stop-opacity", 0.6);
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#1E90FF")
      .attr("stop-opacity", 0.1);

    let minYear = d3.min(missionsArray, d => d.year),
        maxYear = d3.max(missionsArray, d => d.year);
    let x = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([80, width - 80]);
    let y = d3.scaleLinear()
      .domain([0, d3.max(missionsArray, d => d.count)])
      .range([height - 50, 50]);

    // Area + line
    let area = d3.area()
      .x(d => x(d.year))
      .y0(height - 50)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX);
    
    // Create path for the area but set initial points to bottom
    let areaPath = svg.append("path")
      .datum(missionsArray)
      .attr("fill", "url(#area-gradient)")
      .attr("d", d3.area()
        .x(d => x(d.year))
        .y0(height - 50)
        .y1(height - 50)
        .curve(d3.curveMonotoneX)
      );

    let line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);
    
    // Create path for the line but set initial points to bottom
    let linePath = svg.append("path")
      .datum(missionsArray)
      .attr("fill", "none")
      .attr("stroke", "#1E90FF")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => x(d.year))
        .y(d => height - 50)
        .curve(d3.curveMonotoneX)
      );

    // X-axis (years)
    let xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
    svg.append("g")
      .attr("transform", `translate(0,${height - 50})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "#fff");

    // Tooltip on markers
    let tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0);

    // Markers for hover, but start with opacity 0
    let markers = svg.selectAll(".marker")
      .data(missionsArray)
      .enter()
      .append("circle")
      .attr("class", "marker")
      .attr("cx", d => x(d.year))
      .attr("cy", d => height - 50) // Start at bottom
      .attr("r", 5)
      .attr("fill", "#1E90FF")
      .style("opacity", 0)
      .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "#FFD700").attr("r", 8);
          tooltip.html(`Year: ${d.year}<br/>Missions: ${d.count}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("opacity", 1);
      })
      .on("mouseout", function() {
          d3.select(this).attr("fill", "#1E90FF").attr("r", 5);
          tooltip.style("opacity", 0);
      });

    // Create ScrollMagic scene for the missions chart animation
    new ScrollMagic.Scene({
      triggerElement: "#missions-timeline",
      triggerHook: 0.7,
      duration: "50%"
    })
    .on("progress", function(event) {
      const progress = event.progress;
      
      // Animate the area and line paths based on scroll progress
      areaPath.attr("d", d3.area()
        .x(d => x(d.year))
        .y0(height - 50)
        .y1(d => height - 50 + progress * (y(d.count) - (height - 50)))
        .curve(d3.curveMonotoneX)
      );
      
      linePath.attr("d", d3.line()
        .x(d => x(d.year))
        .y(d => height - 50 + progress * (y(d.count) - (height - 50)))
        .curve(d3.curveMonotoneX)
      );
      
      // Animate the markers
      markers
        .attr("cy", d => height - 50 + progress * (y(d.count) - (height - 50)))
        .style("opacity", progress);
    })
    .addTo(controller);

    // Summary
    let missionsSummary = `<p>
      As we scroll through our cosmic journey, witness how human ambition soared beyond Earth's atmosphere. 
      The Cold War era saw the greatest surge in missions as nations raced for technological dominance.
      From Mercury's first tentative steps to the International Space Station's continuous presence, 
      each data point represents humanity's persistent quest to reach further into the stars.
    </p>`;
    d3.select("#missions-summary").html(missionsSummary);
    
    // Handle resize events
    window.addEventListener('resize', function() {
      let newWidth = container.clientWidth - 80;
      svg.attr("viewBox", `0 0 ${newWidth} ${height}`);
      
      // Update scales and redraw elements
      x.range([80, newWidth - 80]);
      
      // Update path elements
      areaPath.attr("d", area);
      linePath.attr("d", line);
        
      // Update markers
      markers.attr("cx", d => x(d.year));
        
      // Update x-axis
      svg.select("g").remove();
      svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "#fff");
    });
  });

  // ================= 2) Spacewalks Timeline with Scroll Animation =================
  d3.json("data/spacewalks.json").then(function(data) {
    let parseDate = d3.timeParse("%m/%d/%Y");
    data = data.filter(d => d.Date && d.Date.trim() !== "");
    data.forEach(d => {
      d.parsedDate = parseDate(d.Date);
    });
    let swByYear = d3.rollup(
      data,
      v => ({
        count: v.length,
        avgDuration: d3.mean(v, d => {
          let parts = d.Duration.split(":");
          return (+parts[0]) * 60 + (+parts[1] || 0);
        })
      }),
      d => d.parsedDate.getFullYear()
    );
    let swData = Array.from(swByYear, ([year, obj]) => ({
      year: new Date(year, 0, 1),
      count: obj.count,
      avgDuration: obj.avgDuration
    }));
    swData.sort((a, b) => a.year - b.year);

    let marginSW = { top: 60, right: 60, bottom: 50, left: 60 },
        widthSW = 800 - marginSW.left - marginSW.right,
        heightSW = 350 - marginSW.top - marginSW.bottom;
    let svgSW = d3.select("#spacewalks-chart")
      .append("svg")
      .attr("width", "100%")
      .attr("height", heightSW + marginSW.top + marginSW.bottom)
      .attr("viewBox", `0 0 ${widthSW + marginSW.left + marginSW.right} ${heightSW + marginSW.top + marginSW.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    let gSW = svgSW.append("g")
      .attr("transform", `translate(${marginSW.left},${marginSW.top})`);

    let xSW = d3.scaleTime()
      .domain(d3.extent(swData, d => d.year))
      .range([0, widthSW]);
    let yLeft = d3.scaleLinear()
      .domain([0, d3.max(swData, d => d.count)])
      .range([heightSW, 0]);
    let yRight = d3.scaleLinear()
      .domain([0, d3.max(swData, d => d.avgDuration)])
      .range([heightSW, 0]);

    let tooltipSW = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0);

    // Create circles for number of spacewalks but start with opacity 0
    let circles = gSW.selectAll(".sw-circle")
      .data(swData)
      .enter()
      .append("circle")
      .attr("class", "sw-circle")
      .attr("cx", d => xSW(d.year))
      .attr("cy", heightSW) // Start at bottom
      .attr("r", 6)
      .attr("fill", "#FF6347")
      .style("opacity", 0)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 8);
        tooltipSW.html(`Year: ${d.year.getFullYear()}<br/>Spacewalks: ${d.count}<br/>Avg Duration: ${d.avgDuration.toFixed(1)} min`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .style("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 6);
        tooltipSW.style("opacity", 0);
      });

    // Create path for the average duration line but start with all points at bottom
    let lineAvg = d3.line()
      .x(d => xSW(d.year))
      .y(d => yRight(d.avgDuration))
      .curve(d3.curveMonotoneX);
    
    let lineAvgPath = gSW.append("path")
      .datum(swData)
      .attr("fill", "none")
      .attr("stroke", "#32CD32")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => xSW(d.year))
        .y(d => heightSW)
        .curve(d3.curveMonotoneX)
      )
      .style("opacity", 0);

    // Axes
    let xAxisSW = d3.axisBottom(xSW).ticks(10).tickFormat(d3.timeFormat("%Y"));
    gSW.append("g")
      .attr("transform", `translate(0,${heightSW})`)
      .call(xAxisSW)
      .selectAll("text")
      .attr("fill", "#fff");
    gSW.append("g")
      .call(d3.axisLeft(yLeft).ticks(5))
      .selectAll("text")
      .attr("fill", "#fff");
    gSW.append("g")
      .attr("transform", `translate(${widthSW},0)`)
      .call(d3.axisRight(yRight).ticks(5))
      .selectAll("text")
      .attr("fill", "#fff");

    // Create ScrollMagic scene for the spacewalks chart animation
    new ScrollMagic.Scene({
      triggerElement: "#spacewalks-timeline",
      triggerHook: 0.7,
      duration: "50%"
    })
    .on("progress", function(event) {
      const progress = event.progress;
      
      // Animate the circles
      circles
        .attr("cy", d => heightSW - progress * (heightSW - yLeft(d.count)))
        .style("opacity", progress);
      
      // Animate the line
      lineAvgPath
        .attr("d", d3.line()
          .x(d => xSW(d.year))
          .y(d => heightSW - progress * (heightSW - yRight(d.avgDuration)))
          .curve(d3.curveMonotoneX)
        )
        .style("opacity", progress);
    })
    .addTo(controller);

    let spacewalksSummary = `<p>
      As you scroll down, experience how astronauts ventured beyond the safety of their spacecraft.
      The red dots showcase years when humans stepped into the void, while the green line reveals 
      how our ability to work in space grew over time—from brief excursions to marathon repair missions.
      Each point represents both technological progress and human courage to float freely in space.
    </p>`;
    d3.select("#spacewalks-summary").html(spacewalksSummary);
  });

  // ================= 3) Most Active Astronauts with Scroll Reveal =================
  d3.json("data/astronauts.json").then(function(data) {
    // Code for active astronauts chart
    let activeMap = d3.rollup(
      data,
      v => d3.max(v, d => +d["Profile.Lifetime Statistics.Mission count"]),
      d => d["Profile.Name"]
    );
    let activeData = Array.from(activeMap, ([name, count]) => ({ name, count: count || 0 }));
    activeData.sort((a, b) => b.count - a.count);
    activeData = activeData.slice(0, 5);

    let widthMA = 900, heightMA = 600;
    let svgMA = d3.select("#most-active-chart")
      .append("svg")
      .attr("width", "100%")
      .attr("height", heightMA)
      .attr("viewBox", `0 0 ${widthMA} ${heightMA}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    let centerX = widthMA / 2, centerY = heightMA / 2;
    
    // Position circles directly
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Radial gradient fill
    let defs = svgMA.append("defs");
    activeData.forEach((d, i) => {
      let grad = defs.append("radialGradient")
        .attr("id", "grad-" + i)
        .attr("cx", "50%").attr("cy", "50%")
        .attr("r", "50%");
      grad.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color(i))
        .attr("stop-opacity", 1);
      grad.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color(i))
        .attr("stop-opacity", 0.5);
    });

    // Calculate positions manually
    const angleStep = (2 * Math.PI) / activeData.length;
    const radius = 200; // Radius from center
    
    activeData.forEach((d, i) => {
      const angle = i * angleStep;
      d.x = centerX + radius * Math.cos(angle);
      d.y = centerY + radius * Math.sin(angle);
      d.startX = centerX;
      d.startY = centerY;
    });
    
    // Create node groups
    let node = svgMA.selectAll(".node")
      .data(activeData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.startX},${d.startY})`) // Start at center
      .style("opacity", 0);

    // Add circles
    node.append("circle")
      .attr("r", d => d.count * 5 + 20)
      .attr("fill", (d, i) => `url(#grad-${i})`)
      .on("mouseover", function(event, d) {
        d3.select(this).transition().duration(200).attr("r", d.count * 5 + 30);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).transition().duration(200).attr("r", d.count * 5 + 20);
      });

    // Text positions
    node.append("text")
      .attr("class", "astronaut-label")
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .text(d => `${d.name} (${d.count})`);

    // Create ScrollMagic scene for astronaut bubbles
    new ScrollMagic.Scene({
      triggerElement: "#most-active",
      triggerHook: 0.7,
      duration: "50%"
    })
    .on("progress", function(event) {
      const progress = event.progress;
      
      // Animate nodes from center to their positions
      node.attr("transform", d => {
        const currentX = d.startX + (d.x - d.startX) * progress;
        const currentY = d.startY + (d.y - d.startY) * progress;
        return `translate(${currentX},${currentY})`;
      })
      .style("opacity", progress);
    })
    .addTo(controller);

    let astronautsSummary = `<p>
      As you delve deeper into space history, meet the intrepid explorers who ventured beyond Earth multiple times.
      Each sphere represents an astronaut whose repeated journeys helped build our understanding of space.
      These space travelers bridged different eras of exploration, from early test flights to space station construction.
    </p>`;
    d3.select("#astronauts-summary").html(astronautsSummary);
  });
});

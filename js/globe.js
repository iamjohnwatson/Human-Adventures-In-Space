// ================= Section 4: Interactive Space Nations Globe ============== //

function createEnhancedSpaceGlobe() {
    // Configuration with improved dimensions for better visibility
    const width = 900;
    const height = 600;
    const globeRadius = 280;
    const sensitivity = 75;
    
    // Create SVG with higher resolution
    const svg = d3.select("#globe-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    
    // Create a cosmic background with better-looking stars
    const bgRect = svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#space-gradient)");
    
    // Add dynamic space gradient
    const defs = svg.append("defs");
    
    // Create a deep space gradient
    const spaceGradient = defs.append("radialGradient")
      .attr("id", "space-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "70%");
      
    spaceGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0a043c");
      
    spaceGradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "#03031a");
      
    spaceGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#000005");
    
    // Create stars with different sizes and twinkle animations
    const starsGroup = svg.append("g").attr("class", "stars");
    const numStars = 300;
    
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 1.5 + 0.5;
      const opacity = Math.random() * 0.8 + 0.2;
      
      // Add stars with random twinkle animation
      const twinkleDuration = 2 + Math.random() * 5;
      const twinkleDelay = Math.random() * 5;
      
      starsGroup.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r)
        .attr("fill", "#fff")
        .attr("opacity", opacity)
        .style("filter", "blur(0.5px)")
        .attr("class", "star")
        .style("animation", `twinkle ${twinkleDuration}s infinite ${twinkleDelay}s`);
    }
    
    // Add star animation style to the document
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes twinkle {
        0% { opacity: 0.2; }
        50% { opacity: 0.8; }
        100% { opacity: 0.2; }
      }
    `;
    document.head.appendChild(styleEl);
    
    // Create a container for the globe with better placement
    const globeGroup = svg.append("g")
      .attr("class", "globe")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    // Create a better projection with initial tilt
    const projection = d3.geoOrthographic()
      .scale(globeRadius)
      .translate([0, 0])
      .rotate([20, -20, 0]); // Initial rotation for better view
    
    // Create a path generator
    let pathGenerator = d3.geoPath().projection(projection);
    
    // Create a more attractive globe outline with atmospheric glow
    const atmosphereGradient = defs.append("radialGradient")
      .attr("id", "atmosphere-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
      
    atmosphereGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4286f4")
      .attr("stop-opacity", 0);
      
    atmosphereGradient.append("stop")
      .attr("offset", "85%")
      .attr("stop-color", "#4286f4")
      .attr("stop-opacity", 0.1);
      
    atmosphereGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4286f4")
      .attr("stop-opacity", 0.8);
    
    // Add atmospheric glow
    globeGroup.append("circle")
      .attr("fill", "url(#atmosphere-gradient)")
      .attr("r", globeRadius + 15);
    
    // Ocean layer gradient
    const oceanGradient = defs.append("radialGradient")
      .attr("id", "ocean-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
      
    oceanGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0077be");
      
    oceanGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#023e73");
    
    // Add ocean base
    globeGroup.append("circle")
      .attr("fill", "url(#ocean-gradient)")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.2)
      .attr("r", projection.scale());
    
    // Create a group for countries
    const countriesGroup = globeGroup.append("g").attr("class", "countries");
    
    // Create a group for mission arcs
    const flightPathsGroup = globeGroup.append("g").attr("class", "flight-paths");
    
    // Create a group for launch sites
    const launchSitesGroup = globeGroup.append("g").attr("class", "launch-sites");
    
    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(10, 10, 40, 0.9)")
      .style("color", "white")
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("border", "1px solid #1E90FF")
      .style("box-shadow", "0 0 15px rgba(30, 144, 255, 0.5)")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("transition", "opacity 0.3s");
    
    // Create a space-themed color scale for countries
    const countryColors = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, 6]);
    
    // Add key launch locations
    const launchSites = [
      { name: "Kennedy Space Center", lat: 28.5, lon: -80.65, country: "United States", missions: 135 },
      { name: "Baikonur Cosmodrome", lat: 45.6, lon: 63.3, country: "Kazakhstan (Russia)", missions: 158 },
      { name: "Jiuquan Satellite Launch Center", lat: 40.9, lon: 100.3, country: "China", missions: 32 },
      { name: "Tanegashima Space Center", lat: 30.4, lon: 130.9, country: "Japan", missions: 18 }
    ];
    
    // Load world GeoJSON and astronaut data
    Promise.all([
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
      d3.json("data/astronauts.json")
    ]).then(([worldData, astronautData]) => {
      // Process astronaut data to get country counts
      const countryCounts = d3.rollup(
        astronautData, 
        v => v.length, 
        d => d["Profile.Nationality"]
      );
      
      // Get top countries by astronaut count
      const topCountries = Array.from(countryCounts, ([country, count]) => ({ 
        country, 
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
      
      // Create mapping for country ISO codes
      const countryNameToISO = {
        "United States": "USA", 
        "Russia": "RUS",
        "Soviet Union": "RUS", 
        "China": "CHN",
        "Japan": "JPN",
        "Germany": "DEU",
        "France": "FRA",
        "Italy": "ITA",
        "Canada": "CAN",
        "United Kingdom": "GBR"
      };
      
      // Reverse mapping
      const isoToCountryName = {};
      Object.entries(countryNameToISO).forEach(([name, iso]) => {
        isoToCountryName[iso] = name;
      });
      
      // Set up ranks for countries to use in coloring
      const countryRanks = {};
      topCountries.forEach((d, i) => {
        countryRanks[d.country] = i;
      });
      
      // Convert TopoJSON to GeoJSON
      const countries = topojson.feature(worldData, worldData.objects.countries).features;
      
      // Draw countries with enhanced styling
      countriesGroup.selectAll(".country")
        .data(countries)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", pathGenerator)
        .attr("fill", function(d) {
          const countryName = isoToCountryName[d.id];
          
          if (countryName && countryRanks[countryName] !== undefined) {
            return countryColors(countryRanks[countryName]);
          }
          
          return "#223"; // Dark blue-gray for non-space countries
        })
        .attr("stroke", "#000")
        .attr("stroke-width", 0.3)
        .on("mouseover", function(event, d) {
          const countryName = isoToCountryName[d.id];
          
          // Highlight country
          d3.select(this)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);
            
          // Only show tooltip if it's a space-faring nation
          if (countryName && countryCounts.has(countryName)) {
            const count = countryCounts.get(countryName);
            
            tooltip.html(`
              <div style="text-align: center;">
                <h3 style="margin: 0; color: #1E90FF;">${countryName}</h3>
                <div style="font-size: 22px; margin: 8px 0;">${count}</div>
                <div style="font-size: 14px; opacity: 0.8;">Astronauts in Space</div>
              </div>
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("opacity", 1);
          }
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke", "#000")
            .attr("stroke-width", 0.3);
          
          tooltip.style("opacity", 0);
        });
      
      // Add pulsing markers for launch sites
      launchSitesGroup.selectAll(".launch-marker")
        .data(launchSites)
        .enter()
        .append("g")
        .attr("class", "launch-marker")
        .attr("transform", d => {
          const coords = projection([d.lon, d.lat]);
          return coords ? `translate(${coords})` : null;
        })
        .each(function(d) {
          const markerGroup = d3.select(this);
          
          // Pulse effect
          const pulse = markerGroup.append("circle")
            .attr("r", 5)
            .attr("fill", "rgba(255, 100, 100, 0.8)")
            .style("filter", "blur(2px)")
            .append("animate")
            .attr("attributeName", "r")
            .attr("values", "5;15;5")
            .attr("dur", "3s")
            .attr("repeatCount", "indefinite");
            
          // Center dot
          markerGroup.append("circle")
            .attr("r", 3)
            .attr("fill", "#ff3333");
        })
        .on("mouseover", function(event, d) {
          tooltip.html(`
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #ff6666;">${d.name}</h3>
              <div style="font-size: 18px; margin: 5px 0;">${d.country}</div>
              <div style="font-size: 14px;">~${d.missions} crewed missions launched</div>
            </div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .style("opacity", 1);
        })
        .on("mouseout", function() {
          tooltip.style("opacity", 0);
        });
      
      // Generate orbital flight paths
      function generateFlightPath(start, end) {
        // Convert to radians
        const startRad = [start[0] * Math.PI/180, start[1] * Math.PI/180];
        const endRad = [end[0] * Math.PI/180, end[1] * Math.PI/180];
        
        // Calculate great circle points
        const numPoints = 100;
        const points = [];
        
        for (let i = 0; i <= numPoints; i++) {
          const t = i / numPoints;
          
          // Interpolate between start and end points along great circle
          const lat = Math.asin(
            Math.sin(startRad[1]) * (1 - t) + Math.sin(endRad[1]) * t
          );
          
          const lng = startRad[0] * (1 - t) + endRad[0] * t;
          
          // Add some altitude variation by pushing points outward
          const altitude = 1.0 + Math.sin(t * Math.PI) * 0.05;
          
          // Convert back to degrees and create a path point
          const point = projection([
            lng * 180/Math.PI, 
            lat * 180/Math.PI
          ]);
          
          if (point) points.push(point);
        }
        
        // Create a path from the points
        return d3.line()(points);
      }
      
      // Define some major space missions with paths
      const majorMissions = [
        { name: "Apollo 11", start: [-80.65, 28.5], end: [180, 0], color: "#FFD700" },
        { name: "Soyuz", start: [63.3, 45.6], end: [-20, 35], color: "#FF4500" },
        { name: "Shenzhou", start: [100.3, 40.9], end: [150, 15], color: "#FF0000" }
      ];
      
      // Add flight paths
      flightPathsGroup.selectAll(".flight-path")
        .data(majorMissions)
        .enter()
        .append("path")
        .attr("class", "flight-path")
        .attr("d", d => generateFlightPath(d.start, d.end))
        .attr("fill", "none")
        .attr("stroke", d => d.color)
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.6)
        .attr("stroke-linecap", "round")
        .style("stroke-dasharray", "0,4,1")
        .each(function() {
          const pathLength = this.getTotalLength();
          d3.select(this)
            .attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .append("animate")
            .attr("attributeName", "stroke-dashoffset")
            .attr("from", pathLength)
            .attr("to", 0)
            .attr("dur", "8s")
            .attr("repeatCount", "indefinite");
        })
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke-width", 3)
            .attr("stroke-opacity", 0.9);
            
          tooltip.html(`
            <div style="text-align: center;">
              <h3 style="margin: 0; color: ${d.color};">${d.name}</h3>
              <div style="font-size: 14px;">Orbital flight path</div>
            </div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .style("opacity", 1);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.6);
            
          tooltip.style("opacity", 0);
        });
      
      // Create an enhanced legend with visual improvements
      const legendContainer = svg.append("g")
        .attr("class", "legend-container")
        .attr("transform", `translate(20, 20)`);
        
// Legend background with adjusted width
legendContainer.append("rect")
  .attr("width", 280) // Increased from 250 to accommodate content
  .attr("height", 42 + topCountries.length * 28)
  .attr("rx", 10)
  .attr("ry", 10)
  .attr("fill", "rgba(10, 10, 40, 0.8)")
  .attr("stroke", "#1E90FF")
  .attr("stroke-width", 1);

// Legend title
legendContainer.append("text")
  .attr("x", 140) // Centered based on new width
  .attr("y", 24)
  .attr("text-anchor", "middle")
  .attr("fill", "#1E90FF")
  .attr("font-weight", "bold")
  .text("Space-Faring Nations");

// Add the legend items group which was missing
const legendItems = legendContainer.selectAll(".legend-item")
  .data(topCountries)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(20, ${i * 28 + 45})`);

// Color squares
legendItems.append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .attr("rx", 3)
  .attr("ry", 3)
  .attr("fill", (d, i) => countryColors(i));

// Country names
legendItems.append("text")
  .attr("x", 28)
  .attr("y", 13)
  .attr("fill", "white")
  .text(d => d.country);

// Astronaut counts
legendItems.append("text")
  .attr("x", 250) // Adjusted position
  .attr("y", 13)
  .attr("text-anchor", "end")
  .attr("fill", "#1E90FF")
  .text(d => d.count);

// Add a better set of instructions
const instructionsGroup = svg.append("g")
  .attr("class", "instructions")
  .attr("transform", `translate(${width/2}, ${height - 40})`) // Adjusted y-position
  .style("visibility", "visible"); // Ensure visibility
      
// Instruction background - fix position and dimensions
instructionsGroup.append("rect")
  .attr("x", -220) 
  .attr("y", -30)
  .attr("width", 440)
  .attr("height", 60)
  .attr("rx", 30)
  .attr("ry", 30)
  .attr("fill", "rgba(10, 10, 40, 0.6)")
  .attr("stroke", "#1E90FF")
  .attr("stroke-width", 1);

// Fix instruction text positioning
instructionsGroup.append("text")
  .attr("text-anchor", "middle")
  .attr("x", 0)
  .attr("y", -5)
  .attr("fill", "#fff")
  .attr("font-family", "'Space Mono', monospace") // Ensure font is applied
  .text("Drag to rotate the globe");

instructionsGroup.append("text")
  .attr("text-anchor", "middle")
  .attr("x", 0)
  .attr("y", 20)
  .attr("fill", "#fff")
  .attr("font-family", "'Space Mono', monospace") // Ensure font is applied
  .text("Click on countries, launch sites and flight paths");


      // Define rotation behavior
      const dragRotate = d3.drag()
        .on("drag", (event) => {
          const rotate = projection.rotate();
          const k = sensitivity / projection.scale();
          projection.rotate([
            rotate[0] + event.dx * k,
            rotate[1] - event.dy * k
          ]);
          pathGenerator = d3.geoPath().projection(projection);
          
          // Update all the elements that depend on the projection
          countriesGroup.selectAll(".country").attr("d", pathGenerator);
          
          // Update launch site positions
          launchSitesGroup.selectAll(".launch-marker")
            .attr("transform", d => {
              const coords = projection([d.lon, d.lat]);
              return coords ? `translate(${coords})` : null;
            });
            
          // Recalculate flight paths
          flightPathsGroup.selectAll(".flight-path")
            .attr("d", d => generateFlightPath(d.start, d.end));
        });
      
      // Apply the drag behavior to the SVG
      svg.call(dragRotate);
      
      // Auto-rotation animation
      function autoRotate() {
        const rotate = projection.rotate();
        const newRotation = [rotate[0] + 0.1, rotate[1]];
        
        // Update projection
        projection.rotate(newRotation);
        pathGenerator = d3.geoPath().projection(projection);
        
        // Update globe elements
        countriesGroup.selectAll(".country").attr("d", pathGenerator);
        
        launchSitesGroup.selectAll(".launch-marker")
          .attr("transform", d => {
            const coords = projection([d.lon, d.lat]);
            return coords ? `translate(${coords})` : null;
          });
          
        flightPathsGroup.selectAll(".flight-path")
          .attr("d", d => generateFlightPath(d.start, d.end));
      }
      
      // Create a smoother rotation using requestAnimationFrame for better performance
      let animationFrameId;
      let isRotating = true;
      
      function animate() {
        if (isRotating) {
          autoRotate();
          animationFrameId = requestAnimationFrame(animate);
        }
      }
      
      // Start animation
      animate();
      
      // Stop rotation on interaction
      svg.on("mousedown", function() {
        isRotating = false;
        cancelAnimationFrame(animationFrameId);
      });
      
      // Add a play/pause button for rotation
      const rotationControlGroup = svg.append("g")
        .attr("class", "rotation-control")
        .attr("transform", `translate(${width - 60}, ${height - 60})`)
        .on("click", function() {
          isRotating = !isRotating;
          if (isRotating) {
            animate();
            playPauseIcon.text("⏸️");
          } else {
            cancelAnimationFrame(animationFrameId);
            playPauseIcon.text("▶️");
          }
        });
        
      rotationControlGroup.append("circle")
        .attr("r", 25)
        .attr("fill", "rgba(10, 10, 40, 0.7)")
        .attr("stroke", "#1E90FF")
        .attr("stroke-width", 1);
        
      const playPauseIcon = rotationControlGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "20px")
        .text("⏸️");
      
      // Explanation below the globe
      const explanation = d3.select("#globe-summary")
  .html(`<p class="globe-explanation">
    Different countries have contributed astronauts reflecting geopolitical priorities, scientific ambitions, and available resources.
      The United States remains dominant due to NASA’s longstanding crewed programs and the added boost from the likes of Blue Origin’s suborbital flights,
      which count toward astronaut numbers. Russia (formerly the Soviet Union) boasts a historic legacy in human spaceflight.
      Nations such as China, Japan, and Canada continue to grow their presence in orbit through independent programs or international collaborations.
  </p>`);
    });
  }
  // Call the function to create the enhanced globe
  document.addEventListener("DOMContentLoaded", function() {
    createEnhancedSpaceGlobe();
  });

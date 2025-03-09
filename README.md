Below is a nicely formatted README in Markdown:

---

# Human Adventures in Space

Human Adventures in Space is an interactive web-based visualization project that explores the history and impact of human spaceflight. It features multiple dynamic visualizations—including timelines, interactive radial charts, and a 3D globe—that bring space exploration data to life.

## Visualizations

### Timeline of Crewed Missions
A gradient-filled area and line chart shows the annual number of crewed missions. The chart highlights how mission activity surged over the decades and peaked toward the end of the Cold War. Hovering over markers reveals detailed mission counts.

### Spacewalks Timeline
A scatter plot displays the annual number of spacewalks (red dots) with an overlaid green line showing the average duration of EVAs. Tooltips reveal additional information on hover.

### Most Active Astronauts
A creative radial visualization features interactive bubbles representing the astronauts with the highest mission counts. Text labels are positioned differently based on the astronaut’s name (e.g. “Ross, Jerry L” and “Musgrave, Franklin Story” appear to the right, while “Young, John W.” and “Krikalev, Sergei” appear to the left, and “Chang-Diaz, Franklin R.” below).

### Space-Faring Nations Globe
An interactive 3D globe visualization (powered by Three.js and D3.js) shows contributions by different nations, including animated flight paths, launch site markers, and atmospheric effects. The globe offers an engaging look at global participation in human spaceflight.

## Features

- **Immersive Aesthetics:**  
  A starfield parallax background, space-themed color gradients, and custom fonts from Google Fonts set the cosmic tone.
- **Background Music:**  
  Royalty-free, space-themed music plays in the background, with controls to toggle the audio on and off.
- **Responsive Design:**  
  All visualizations are designed to be responsive and work across different devices.

## Files

- **index.html** — The main HTML file.  
- **css/style.css** — Custom styles for layout, typography, and animations.  
- **js/app.js** — D3.js and GSAP-powered visualizations for timelines and astronaut data.  
- **js/globe.js** — The 3D globe visualization showing space-faring nations and mission flight paths.  
- **data/astronauts.json** — Dataset of astronaut profiles and mission details.  
- **data/spacewalks.json** — Dataset containing spacewalk information.  
- **data/background.jpg** — Background image for the starfield effect (downloaded from Unsplash).

## Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/human-adventures-in-space.git
   ```
2. **Navigate to the Project Folder:**
   ```bash
   cd human-adventures-in-space
   ```
3. **Open `index.html` in Your Browser:**  
   Simply open the file in your preferred web browser to experience the interactive visualizations.

## Dependencies

This project uses several libraries loaded via CDN:
- **D3.js v7**
- **GSAP**
- **ScrollMagic**
- **Three.js**
- **TopoJSON**
- **OrbitControls**
- **FontLoader (Three.js)**

## Data Sources

- **Astronaut and Spacewalk Data:**  
  Courtesy of the [CORGIS Dataset Project](https://corgis-edu.github.io/corgis/).

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- Thanks to the CORGIS Dataset Project for the data.
- Inspired by interactive graphics from Reuters Graphics and other data visualization pioneers.

---


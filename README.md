# kolleh-lab

3D visualization of Kolleh Town (Freetown, Sierra Leone) using MapLibre GL JS with LiDAR point cloud data, drone imagery, and interactive layer controls.

## Repository structure

- `/src`: Source code for the web application (Vite project)
- `/docs`: Static website built for GitHub Pages deployment
- `/convert`: PDAL pipeline definitions for COPC data conversion

## Features

- **Interactive 3D Map**: MapLibre GL JS v4.0.0+ with pitch/bearing controls and hash-based URL state
- **LiDAR Point Cloud Visualization**: Dynamic COPC streaming via [maplibre-gl-lidar](https://github.com/opengeos/maplibre-gl-lidar)
  - Elevation-based coloring with customizable colormaps
  - Z-offset correction for geoid height alignment (-18m for Freetown area)
  - Interactive controls for point size, opacity, and elevation filtering
- **3D Terrain Integration**: Custom terrain source using Mapterhorn DEM tiles
  - Terrarium encoding for accurate elevation data
  - Toggle-able via LiDAR control panel
  - Exaggeration control (default: 1.0x)
- **Layer Toggle Control**: Interactive UI powered by [maplibre-gl-layer-control](https://github.com/opengeos/maplibre-gl-layer-control)
  - UAV imagery visibility (default opacity: 0.5 for transparency)
  - Place names overlay
- **Drone Imagery Overlay**: High-resolution aerial photography (2025-10-22)
- **Vector Basemap**: Protomaps-based labels and place names with zoom-responsive sizing
- **Proper Attribution**: Data source credits for point cloud and drone imagery

## Development

### Prerequisites

- Node.js (v18+)
- npm
- Just (task runner, optional)
- PDAL (for point cloud conversion)

### Setup

```bash
# Install dependencies
just install
# or
npm install
```

### Development Server

```bash
# Start Vite dev server at http://localhost:3000
just dev
# or
npm run dev
```

### Build for Production

```bash
# Build static site to /docs folder for GitHub Pages
just build
# or
npm run build
```

The build process:
- Bundles source from `/src` to `/docs`
- Uses relative paths (`base: './'`) for flexible hosting
- Removes content hashes from filenames for stable references
- Generates optimized CSS and JavaScript bundles

### Preview Production Build

```bash
# Preview production build locally
just preview
# or
npm run preview
```

## Technical Details

### LiDAR Point Cloud Configuration

The COPC point cloud visualization includes:
- **Z-offset**: -18 meters (geoid height correction for Freetown, Sierra Leone based on EGM2008)
- **Auto Z-offset**: Disabled to preserve manual geoid correction
- **Color scheme**: Elevation-based with viridis colormap
- **Point budget**: Default streaming settings for optimal performance
- **Terrain alignment**: Custom mapterhorn DEM source for accurate 3D visualization

### Map Configuration

- **Center**: [-13.248147, 8.466554] (Kolleh Town, Freetown)
- **Initial zoom**: 12
- **Initial pitch**: 30°
- **Max pitch**: 85° (for 3D viewing)
- **Hash navigation**: Enabled for shareable URLs

## `convert` folder (COPC conversion pipeline)

The `convert` directory contains PDAL pipeline definitions to convert raw LAZ point-cloud files into COPC-formatted LAZ files optimized for web streaming.

**Files:**
- `pipeline.json`: Reads `Kolleh-Town-06-04-2024-georeferenced_model.laz` and writes `kolleh.copc.laz` using `writers.copc`.
- `pipeline_v.json`: Similar to `pipeline.json` but writes `kolleh_v.copc.laz` with custom `scale_x`, `scale_y`, and `scale_z` settings.
- `Justfile`: Defines a `convert` task that runs both PDAL pipelines.

**Usage:**

1. Ensure PDAL is installed and available in your PATH.
2. From the repository root, run the conversion task:

```bash
just convert
# or
pdal pipeline convert/pipeline.json
pdal pipeline convert/pipeline_v.json
```

**Notes:**
- Input LAZ files (e.g. `Kolleh-Town-06-04-2024-georeferenced_model.laz`) are large and excluded from version control via `.gitignore`.
- Output COPC files are produced in the `convert` folder: `kolleh.copc.laz` and `kolleh_v.copc.laz`.

## Technologies

### Frontend Stack
- **MapLibre GL JS** v4.0.0+: Open-source WebGL mapping library
- **maplibre-gl-lidar** v0.7.0: Dynamic COPC point cloud renderer with elevation coloring and terrain integration
- **maplibre-gl-layer-control** v0.9.0: Interactive layer visibility control
- **Vite** v5.0.0+: Fast build tool and dev server with ES6 module support

### Data Processing
- **PDAL**: Point cloud conversion and processing
- **Just**: Task automation and workflow management

### Build Configuration
- **Base path**: Relative (`./`) for GitHub Pages compatibility
- **Asset naming**: Hash-free for stable references (`index.js`, `index.css`)
- **Output directory**: `/docs` (GitHub Pages source)
- **Source directory**: `/src` (Vite root)

## External Resources

All tile services are hosted at `https://tunnel.optgeo.org/martin/`:

- **Terrain (Mapterhorn)**: `mapterhorn/{z}/{x}/{y}`
  - Format: Terrarium DEM tiles (512×512 WebP)
  - Encoding: Terrarium (R\*256 + G + B/256 - 32768)
  - Max zoom: 12
  - Usage: 3D terrain and hillshade rendering
  - Integration: Custom terrain source for maplibre-gl-lidar

- **Drone Imagery**: `freetown_2025-10-22_nearest/{z}/{x}/{y}`
  - Format: 512×512 WebP
  - Max zoom: 21
  - Default opacity: 0.5 (for point cloud visibility)
  - Attribution: Drone imagery contributors (tbc)

- **Vector Basemap**: `protomaps-basemap/{z}/{x}/{y}`
  - Format: Protomaps vector tiles
  - Max zoom: 14
  - Layers: places, boundaries, buildings, roads, water, landcover, landuse, pois, earth
  - Font stack: Noto Sans Regular
  - Text sizing: Zoom-responsive (10px at z1, 16px at z15)

- **LiDAR Point Cloud**: `https://tunnel.optgeo.org/kolleh_v.copc.laz`
  - Format: COPC (Cloud Optimized Point Cloud)
  - Size: ~15 MB
  - Coordinate system: Ellipsoidal heights (WGS84)
  - Z-offset applied: -18m (geoid height correction)
  - Attribution: Point cloud contributors (tbc)

## Data Sources

- **Original 3D Model**: [Crankyserver](https://crankyserver.com/public/task/fa53e17e-b20b-4970-8f2d-f846a22036b0/3d/)
- **Processing Organization**: [LocalDevices](https://localdevices.org/)
- **Geoid Model**: EGM2008 (for height correction)

## Geospatial Considerations

### Vertical Datum Alignment

The visualization aligns data from different vertical datums:
- **Point Cloud**: Ellipsoidal heights (WGS84 ellipsoid)
- **Terrain DEM**: Orthometric heights (mean sea level / geoid)
- **Correction Applied**: -18m Z-offset (approximate EGM2008 geoid height for Freetown)

This ensures accurate vertical alignment between the LiDAR point cloud and the underlying terrain model.

## Acknowledgments

This project is made possible by the excellent work of many open-source projects and organizations:

- **[MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js)**: The foundation of our interactive 3D mapping
- **[maplibre-gl-lidar](https://github.com/opengeos/maplibre-gl-lidar)**: Enabling seamless COPC point cloud visualization
- **[maplibre-gl-layer-control](https://github.com/opengeos/maplibre-gl-layer-control)**: Providing intuitive layer management UI
- **[Vite](https://vitejs.dev/)**: Fast and modern build tooling
- **[PDAL](https://pdal.io/)**: Point cloud processing and COPC conversion
- **[LocalDevices](https://localdevices.org/)**: Processing and hosting the 3D model data
- **[Protomaps](https://protomaps.com/)**: Open-source vector basemap tiles
- **Martin Tile Server**: Hosting our terrain and imagery tile services

We are grateful to all contributors and maintainers of these projects for making this visualization possible.

## Attribution and Contributing

**Note on Data Attribution**: Due to the experimental nature of this project, some data source attributions may be incomplete. We are working to ensure proper credit is given to all data contributors, including:
- Point cloud data providers
- Drone imagery operators
- Terrain data sources

If you have information about the proper attribution for any data sources used in this project, or if you notice any missing credits, **pull requests are welcome**. Please help us ensure all contributors receive proper recognition.

To contribute:
1. Fork this repository
2. Add or update attribution information
3. Submit a pull request with a clear description of the changes

We appreciate your help in making this project properly acknowledge all contributors.

## License

See [LICENSE](LICENSE) file for details.

## Related Projects

- [hiker](https://github.com/hfu/hiker): Reference implementation for terrain and basemap integration

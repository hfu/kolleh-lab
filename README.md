# kolleh-lab

## Repository structure
- /docs: GitHub Pages resources
- /convert: COPC data conversion scripts

## `convert` folder (conversion pipeline)
The `convert` directory contains PDAL pipeline definitions and a small task to convert raw LAZ point-cloud files into COPC-formatted LAZ files.

- `pipeline.json`: reads `Kolleh-Town-06-04-2024-georeferenced_model.laz` and writes `kolleh.copc.laz` using `writers.copc`.
- `pipeline_v.json`: similar to `pipeline.json` but writes `kolleh_v.copc.laz` and applies custom `scale_x`, `scale_y`, and `scale_z` settings.
- `Justfile`: defines a `convert` task that runs both PDAL pipelines (calls `pdal pipeline pipeline.json` and `pdal pipeline pipeline_v.json`).

Usage

1. Ensure PDAL is installed and available in your PATH.
2. From the repository root, run the `convert` task with `just` (or invoke PDAL directly):

```bash
just convert
# or
pdal pipeline convert/pipeline.json
pdal pipeline convert/pipeline_v.json
```

Notes

- Input LAZ files (e.g. `Kolleh-Town-06-04-2024-georeferenced_model.laz`) are large and are excluded from version control via `.gitignore`.
- Output COPC files are produced alongside the input; check the `convert` folder for `kolleh.copc.laz` and `kolleh_v.copc.laz` after running the pipelines.

## `docs` folder (static web site for GitHub Pages)
- consists of index.html and style.css
- MapLibre GL JS web site with https://github.com/opengeos/maplibre-gl-lidar enabled. 
- Reads https://tunnel.optgeo.org/kolleh_v.copc.laz by maplibre-gl-lidar.
- Based on imagery, basemap annotation, and 3D terrain; if necessary, make use of what we have develoed in https://github.com/hfu/hiker. 

## External resources for docs
- https://tunnel.optgeo.org/martin/mapterhorn/{z}/{x}/{y}: Terrarium Tiles for 3D terrain and hillshades. 512x512 WebP. 
- https://tunnel.optgeo.org/martin/freetown_2025-10-22_nearest/{z}/{x}/{y}: Drone imagery. 512x512 WebP. 
- https://tunnel.optgeo.org/martin/protomaps-basemap/{z}/{x}/{y}: Vector basemap. 

## Sources
- https://crankyserver.com/public/task/fa53e17e-b20b-4970-8f2d-f846a22036b0/3d/

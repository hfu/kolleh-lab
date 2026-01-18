# Development and Build Tasks

# Install dependencies
install:
    npm install

# Development server (hot reload)
dev:
    npm run dev

# Build for production
build:
    npm run build

# Preview production build locally
preview:
    npm run preview

# Convert point cloud data (PDAL pipelines)
convert:
    pdal pipeline convert/pipeline.json
    pdal pipeline convert/pipeline_v.json

# Clean build output and node_modules
clean:
    rm -rf dist node_modules

# Full reset: clean, reinstall, and build
reset: clean install build

import maplibregl from 'maplibre-gl';
import { LidarControl } from 'maplibre-gl-lidar';
import 'maplibre-gl-lidar/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// Initialize map
const map = new maplibregl.Map({
    container: 'map',
    style: {
        'version': 8,
        'glyphs': 'https://hfu.github.io/hiker/vendor/basemaps-assets/fonts/{fontstack}/{range}.pbf',
        'sources': {
            'mapterhorn': {
                'type': 'raster',
                'tiles': ['https://tunnel.optgeo.org/martin/mapterhorn/{z}/{x}/{y}'],
                'tileSize': 512,
                'minzoom': 0,
                'maxzoom': 12
            },
            'uav-imagery': {
                'type': 'raster',
                'tiles': ['https://tunnel.optgeo.org/martin/freetown_2025-10-22_nearest/{z}/{x}/{y}'],
                'tileSize': 512,
                'minzoom': 0,
                'maxzoom': 16
            },
            'protomaps': {
                'type': 'vector',
                'tiles': ['https://tunnel.optgeo.org/martin/protomaps-basemap/{z}/{x}/{y}'],
                'minzoom': 0,
                'maxzoom': 14
            }
        },
        'layers': [
            {
                'id': 'background',
                'type': 'background',
                'paint': {
                    'background-color': '#87CEEB'
                }
            },
            {
                'id': 'mapterhorn-hillshade',
                'type': 'raster',
                'source': 'mapterhorn',
                'paint': {
                    'raster-opacity': 0.7
                }
            },
            {
                'id': 'uav-imagery',
                'type': 'raster',
                'source': 'uav-imagery',
                'paint': {
                    'raster-opacity': 0.85
                }
            },
            {
                'id': 'protomaps-labels',
                'type': 'symbol',
                'source': 'protomaps',
                'source-layer': 'labels',
                'layout': {
                    'text-field': ['get', 'name'],
                    'text-size': 12,
                    'text-offset': [0, 1]
                },
                'paint': {
                    'text-color': '#000',
                    'text-halo-color': '#fff',
                    'text-halo-width': 1
                }
            }
        ]
    },
    container: 'map',
    hash: 'map',
    center: [-13.248147, 8.466554],
    zoom: 12,
    pitch: 30,
    bearing: 0
});

// Add navigation controls
map.addControl(new maplibregl.NavigationControl());
map.addControl(new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'metric'
}));
map.addControl(new maplibregl.FullscreenControl());

// Log map ready and add COPC layer
map.on('load', () => {
    console.log('Map loaded. Initializing COPC visualization...');
    
    // Add COPC layer using maplibre-gl-lidar
    const lidarControl = new LidarControl({
        title: 'LiDAR Viewer',
        collapsed: true,
        pointSize: 2,
        colorScheme: 'elevation',
        pickable: false,
        autoZoom: true
    });
    
    map.addControl(lidarControl, 'top-right');
    
    // Load COPC point cloud
    lidarControl.loadPointCloud(
        'https://tunnel.optgeo.org/kolleh_v.copc.laz'
    ).then(() => {
        console.log('COPC point cloud loaded successfully!');
    }).catch((err) => {
        console.error('Failed to load COPC point cloud:', err);
    });
});

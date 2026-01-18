import maplibregl from 'maplibre-gl';
import { LidarControl } from 'maplibre-gl-lidar';
import 'maplibre-gl-lidar/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// Initialize map
const map = new maplibregl.Map({
    container: 'map',
    style: {
        'version': 8,
        'sources': {
            'protomaps': {
                'type': 'vector',
                'tiles': ['https://tunnel.optgeo.org/martin/protomaps-basemap/{z}/{x}/{y}'],
                'minzoom': 0,
                'maxzoom': 14
            },
            'mapterhorn': {
                'type': 'raster',
                'tiles': ['https://tunnel.optgeo.org/martin/mapterhorn/{z}/{x}/{y}'],
                'tileSize': 512,
                'minzoom': 0,
                'maxzoom': 12
            }
        },
        'layers': [
            {
                'id': 'background',
                'type': 'background',
                'paint': {
                    'background-color': '#ddd'
                }
            },
            {
                'id': 'mapterhorn-layer',
                'type': 'raster',
                'source': 'mapterhorn',
                'paint': {
                    'raster-opacity': 0.85
                }
            },
            {
                'id': 'protomaps-layer',
                'type': 'fill',
                'source': 'protomaps',
                'source-layer': 'buildings',
                'paint': {
                    'fill-color': '#888',
                    'fill-opacity': 0.3
                }
            }
        ]
    },
    center: [-13.248147, 8.466554],
    zoom: 12,
    pitch: 0,
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

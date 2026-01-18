import maplibregl from 'maplibre-gl';
import { LidarControl } from 'maplibre-gl-lidar';
import { LayerControl } from 'maplibre-gl-layer-control';
import 'maplibre-gl-lidar/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-layer-control/style.css';

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
                'maxzoom': 21,
                'attribution': 'Drone imagery contributors (tbc)'
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
                'id': 'uav-imagery',
                'type': 'raster',
                'source': 'uav-imagery',
                'paint': {
                    'raster-opacity': 0.85
                }
            },
            {
                'id': 'protomaps-places',
                'type': 'symbol',
                'source': 'protomaps',
                'source-layer': 'places',
                'minzoom': 1,
                'layout': {
                    'text-field': ['get', 'name'],
                    'text-size': ['interpolate', ['linear'], ['zoom'], 1, 10, 15, 16],
                    'text-font': ['Noto Sans Regular'],
                    'text-max-width': 8,
                    'text-anchor': 'center'
                },
                'paint': {
                    'text-color': '#222',
                    'text-halo-color': '#fff',
                    'text-halo-width': 1,
                    'text-opacity': 1
                }
            }
        ]
    },
    container: 'map',
    hash: 'map',
    center: [-13.248147, 8.466554],
    zoom: 12,
    pitch: 30,
    bearing: 0,
    maxPitch: 85,
    customAttribution: 'Point cloud contributors (tbc)'
});

// Add navigation controls
map.addControl(new maplibregl.NavigationControl());
map.addControl(new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'metric'
}));
map.addControl(new maplibregl.FullscreenControl());

// Add layer control
map.addControl(new LayerControl({
    layers: [
        { id: 'uav-imagery', title: 'UAV Imagery' },
        { id: 'protomaps-places', title: 'Place Names' }
    ]
}), 'top-left');

// Global reference for LiDAR control
let lidarControl;
let lidarLoaded = false;

// Log map ready and add COPC layer
map.on('load', () => {
    console.log('Map loaded. Initializing COPC visualization...');
    
    // Add custom terrain source for mapterhorn before LidarControl
    map.addSource('terrain-dem', {
        'type': 'raster-dem',
        'tiles': ['https://tunnel.optgeo.org/martin/mapterhorn/{z}/{x}/{y}'],
        'encoding': 'terrarium',
        'tileSize': 512,
        'maxzoom': 12
    });
    
    // Add COPC layer using maplibre-gl-lidar
    lidarControl = new LidarControl({
        title: 'LiDAR Viewer',
        collapsed: true,
        pointSize: 2,
        colorScheme: 'elevation',
        pickable: false,
        autoZoom: true,
        zOffsetEnabled: true,
        zOffset: -18,
        autoZOffset: false,
        terrainEnabled: true,
        terrainExaggeration: 1.0
    });
    
    map.addControl(lidarControl, 'top-right');
    
    // Load COPC point cloud
    lidarControl.loadPointCloud(
        'https://tunnel.optgeo.org/kolleh_v.copc.laz'
    ).then(() => {
        lidarLoaded = true;
        console.log('COPC point cloud loaded successfully!');
        // Apply Z offset after loading
        lidarControl.setZOffset(-18);
        console.log('Z offset set to -18m (geoid height correction)');
        // Update checkbox state
        const checkbox = document.getElementById('toggle-lidar');
        if (checkbox) checkbox.checked = true;
    }).catch((err) => {
        console.error('Failed to load COPC point cloud:', err);
    });
});

// Export toggleLidar function for LayerToggleControl
window.toggleLidar = function(checked) {
    if (!lidarControl) return;
    
    if (checked && !lidarLoaded) {
        lidarControl.loadPointCloud(
            'https://tunnel.optgeo.org/kolleh_v.copc.laz'
        ).then(() => {
            lidarLoaded = true;
            console.log('LiDAR toggled on');
        }).catch((err) => {
            console.error('Failed to load LiDAR:', err);
        });
    } else if (!checked && lidarLoaded) {
        lidarControl.unloadPointCloud();
        lidarLoaded = false;
        console.log('LiDAR toggled off');
    }
};

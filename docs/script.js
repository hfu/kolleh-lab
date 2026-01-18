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
                'maxzoom': 14
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
    zoom: 13,
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
    try {
        const copcLayer = new maplibreGlLidar.MaplibreGlLidar({
            url: 'https://tunnel.optgeo.org/kolleh_v.copc.laz',
            colorScheme: 'elevation',
            pointSize: 2.0
        });
        map.addLayer(copcLayer.getLayer());
        console.log('COPC layer added successfully!');
    } catch (err) {
        console.warn('COPC layer initialization:', err.message);
    }
});

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

// Log map ready
map.on('load', () => {
    console.log('Map loaded. Ready for enhancements!');
});

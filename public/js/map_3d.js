import { map } from './control_3d/map.js'
import { load3dTileset } from './control_3d/3d_tileset.js'
import { addViewField, clearAllViewField } from './control_3d/viewshed.js';
import { initIdentifyTool, toggleIdentifyTool } from './control_3d/identify_tool.js';

//MODELOS 3D
for (let tilesetSetup of [
    {
        url: "/3d/tileset.json",
        heightOffset: 75,
        id: "qgex",
        locate: {
            lon: -47.914694,
            lat: -15.775599,
            height: 1150
        }
    }
]) {
    let tileset = load3dTileset(map, tilesetSetup)
    // Nome das imagens para o Fly To
    if (tilesetSetup.id === "qgex") {
        var tilesetAMAN = tilesetSetup.locate;
    }
}


const scene = map.scene;

//TOOLS
const removeAllTools = () => {
    measure._drawLayer.entities.removeAll();
    measure.removeDrawLineMeasureGraphics()
    measure.removeDrawAreaMeasureGraphics()
    clearAllViewField()
}

let clampToGround = true
const measure = new Cesium.Measure(map)

initIdentifyTool();

export function activeTool() {
    let text = $(this).attr('id')
    if (text) {
        removeAllTools()
        switch (text) {
            case 'distancia':
                measure.drawLineMeasureGraphics({ clampToGround: clampToGround, callback: () => { } });
                break;
            case 'area':
                measure.drawAreaMeasureGraphics({ clampToGround: clampToGround, callback: () => { } });
                break;
            case 'visualizacao':
                addViewField(map)
                break;
            case 'identify-tool':
                toggleIdentifyTool();
                break;
        }
    }
}


export function handleClickGoTo() {
    let text = $(this).attr('id')
    if (text) {
        removeAllTools()
        switch (text) {
            case 'qgex':
                var { lat, lon, height } = tilesetAMAN
                break;
        }
        map.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        });
    }
}


var { lat, lon, height } = tilesetAMAN
map.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
});

$('#locate-3d-container button').click(handleClickGoTo);

var handler = new Cesium.ScreenSpaceEventHandler(map.canvas);
handler.setInputAction(function (event) {
    var scratchRectangle = new Cesium.Rectangle();
    var pickedPosition = map.scene.pickPosition(event.position);
    if (Cesium.defined(pickedPosition)) {
        var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickedPosition);
        var lon = Cesium.Math.toDegrees(carto.longitude);
        var lat = Cesium.Math.toDegrees(carto.latitude);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

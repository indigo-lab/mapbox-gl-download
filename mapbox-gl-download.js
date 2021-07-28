import FileSaver from 'file-saver';

export default class DownloadControl {
  constructor(options) {
    this._options = options || {};
  }
  onAdd(map) {
    const template = document.createElement("template");
    template.insertAdjacentHTML("afterbegin", `<div class="mapboxgl-ctrl mapboxgl-ctrl-group">
<button type='button' title='Download features as GeoJSON' class='mapbox-ctrl-download'>
<span class='mapboxgl-ctrl-icon' aria-hidden='true'></span>
</button>
</div>`);

    this._container = template.removeChild(template.firstChild);
    this._container.firstElementChild.addEventListener("click", e => {
      this.onClick(e);
    });
    this._map = map;
    return this._container;
  }
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
  onClick(e) {
    let features = this._map.queryRenderedFeatures();
    if (this._options.onEachFeature)
      features = features.map(this._options.onEachFeature).filter(f => f !== null);
    features = features.map(a => {
      const src = a.toJSON();
      const dst = {};
      Object.keys(src).forEach(k => {
        if (["id", "type", "properties", "geometry"].indexOf(k) !== -1)
          dst[k] = src[k];
      });
      return dst;
    });
    if (features.length === 0) {
      alert("No feature.");
      return;
    }
    const json = {
      "type": "FeatureCollection",
      "features": features
    };
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json;charset=utf-8"
    });
    FileSaver.saveAs(blob, `mapbox-gl-download_${new Date().getTime()}.json`);
  }
}

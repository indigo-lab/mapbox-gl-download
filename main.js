import DownloadControl from './mapbox-gl-download.js';

(function(target) {
  if (!target) return;
  if (target.DownloadControl) return;
  target.DownloadControl = DownloadControl;
})(window.mapboxgl || window.maplibregl);

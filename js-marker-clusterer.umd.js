'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('js-marker-clusterer'), require('rxjs/Observable'), require('@agm/core')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'js-marker-clusterer', 'rxjs/Observable', '@agm/core'], factory) : factory((global.ngmaps = global.ngmaps || {}, global.ngmaps.jsMarkerClusterer = global.ngmaps.jsMarkerClusterer || {}), global.ng.core, null, global.Rx, global.ngmaps.core);
})(undefined, function (exports, _angular_core, jsMarkerClusterer, rxjs_Observable, _agm_core) {
    'use strict';

    var MapsAPILoader = function () {
        function MapsAPILoader() {}
        return MapsAPILoader;
    }();
    MapsAPILoader.decorators = [{ type: _angular_core.Injectable }];
    /** @nocollapse */
    MapsAPILoader.ctorParameters = function () {
        return [];
    };

    /**
     * Wrapper class that handles the communication with the Google Maps Javascript
     * API v3
     */
    var GoogleMapsAPIWrapper = function () {
        function GoogleMapsAPIWrapper(_loader, _zone) {
            var _this = this;
            this._loader = _loader;
            this._zone = _zone;
            this._map = new Promise(function (resolve) {
                _this._mapResolver = resolve;
            });
        }
        GoogleMapsAPIWrapper.prototype.createMap = function (el, mapOptions) {
            var _this = this;
            return this._loader.load().then(function () {
                var map = new google.maps.Map(el, mapOptions);
                _this._mapResolver(map);
                return;
            });
        };
        GoogleMapsAPIWrapper.prototype.setMapOptions = function (options) {
            this._map.then(function (m) {
                m.setOptions(options);
            });
        };
        /**
         * Creates a google map marker with the map context
         */
        GoogleMapsAPIWrapper.prototype.createMarker = function (options, addToMap) {
            if (options === void 0) {
                options = {};
            }
            if (addToMap === void 0) {
                addToMap = true;
            }
            return this._map.then(function (map) {
                if (addToMap) {
                    options.map = map;
                }
                return new google.maps.Marker(options);
            });
        };
        GoogleMapsAPIWrapper.prototype.createInfoWindow = function (options) {
            return this._map.then(function () {
                return new google.maps.InfoWindow(options);
            });
        };
        /**
         * Creates a google.map.Circle for the current map.
         */
        GoogleMapsAPIWrapper.prototype.createCircle = function (options) {
            return this._map.then(function (map) {
                options.map = map;
                return new google.maps.Circle(options);
            });
        };
        GoogleMapsAPIWrapper.prototype.createPolyline = function (options) {
            return this.getNativeMap().then(function (map) {
                var line = new google.maps.Polyline(options);
                line.setMap(map);
                return line;
            });
        };
        GoogleMapsAPIWrapper.prototype.createPolygon = function (options) {
            return this.getNativeMap().then(function (map) {
                var polygon = new google.maps.Polygon(options);
                polygon.setMap(map);
                return polygon;
            });
        };
        /**
         * Creates a new google.map.Data layer for the current map
         */
        GoogleMapsAPIWrapper.prototype.createDataLayer = function (options) {
            return this._map.then(function (m) {
                var data = new google.maps.Data(options);
                data.setMap(m);
                return data;
            });
        };
        /**
         * Determines if given coordinates are insite a Polygon path.
         */
        GoogleMapsAPIWrapper.prototype.containsLocation = function (latLng, polygon) {
            return google.maps.geometry.poly.containsLocation(latLng, polygon);
        };
        GoogleMapsAPIWrapper.prototype.subscribeToMapEvent = function (eventName) {
            var _this = this;
            return rxjs_Observable.Observable.create(function (observer) {
                _this._map.then(function (m) {
                    m.addListener(eventName, function (arg) {
                        _this._zone.run(function () {
                            return observer.next(arg);
                        });
                    });
                });
            });
        };
        GoogleMapsAPIWrapper.prototype.setCenter = function (latLng) {
            return this._map.then(function (map) {
                return map.setCenter(latLng);
            });
        };
        GoogleMapsAPIWrapper.prototype.getZoom = function () {
            return this._map.then(function (map) {
                return map.getZoom();
            });
        };
        GoogleMapsAPIWrapper.prototype.getBounds = function () {
            return this._map.then(function (map) {
                return map.getBounds();
            });
        };
        GoogleMapsAPIWrapper.prototype.setZoom = function (zoom) {
            return this._map.then(function (map) {
                return map.setZoom(zoom);
            });
        };
        GoogleMapsAPIWrapper.prototype.getCenter = function () {
            return this._map.then(function (map) {
                return map.getCenter();
            });
        };
        GoogleMapsAPIWrapper.prototype.panTo = function (latLng) {
            return this._map.then(function (map) {
                return map.panTo(latLng);
            });
        };
        GoogleMapsAPIWrapper.prototype.panBy = function (x, y) {
            return this._map.then(function (map) {
                return map.panBy(x, y);
            });
        };
        GoogleMapsAPIWrapper.prototype.fitBounds = function (latLng) {
            return this._map.then(function (map) {
                return map.fitBounds(latLng);
            });
        };
        GoogleMapsAPIWrapper.prototype.panToBounds = function (latLng) {
            return this._map.then(function (map) {
                return map.panToBounds(latLng);
            });
        };
        /**
         * Returns the native Google Maps Map instance. Be careful when using this instance directly.
         */
        GoogleMapsAPIWrapper.prototype.getNativeMap = function () {
            return this._map;
        };
        /**
         * Triggers the given event name on the map instance.
         */
        GoogleMapsAPIWrapper.prototype.triggerMapEvent = function (eventName) {
            return this._map.then(function (m) {
                return google.maps.event.trigger(m, eventName);
            });
        };
        return GoogleMapsAPIWrapper;
    }();
    GoogleMapsAPIWrapper.decorators = [{ type: _angular_core.Injectable }];
    /** @nocollapse */
    GoogleMapsAPIWrapper.ctorParameters = function () {
        return [{ type: MapsAPILoader }, { type: _angular_core.NgZone }];
    };

    var MarkerManager$1 = function () {
        function MarkerManager$$1(_mapsWrapper, _zone) {
            this._mapsWrapper = _mapsWrapper;
            this._zone = _zone;
            this._markers = new Map();
        }
        MarkerManager$$1.prototype.deleteMarker = function (marker) {
            var _this = this;
            var m = this._markers.get(marker);
            if (m == null) {
                // marker already deleted
                return Promise.resolve();
            }
            return m.then(function (m) {
                return _this._zone.run(function () {
                    m.setMap(null);
                    _this._markers.delete(marker);
                });
            });
        };
        MarkerManager$$1.prototype.updateMarkerPosition = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setPosition({ lat: marker.latitude, lng: marker.longitude });
            });
        };
        MarkerManager$$1.prototype.updateTitle = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setTitle(marker.title);
            });
        };
        MarkerManager$$1.prototype.updateLabel = function (marker) {
            return this._markers.get(marker).then(function (m) {
                m.setLabel(marker.label);
            });
        };
        MarkerManager$$1.prototype.updateDraggable = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setDraggable(marker.draggable);
            });
        };
        MarkerManager$$1.prototype.updateIcon = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setIcon(marker.iconUrl);
            });
        };
        MarkerManager$$1.prototype.updateOpacity = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setOpacity(marker.opacity);
            });
        };
        MarkerManager$$1.prototype.updateVisible = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setVisible(marker.visible);
            });
        };
        MarkerManager$$1.prototype.updateZIndex = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setZIndex(marker.zIndex);
            });
        };
        MarkerManager$$1.prototype.updateClickable = function (marker) {
            return this._markers.get(marker).then(function (m) {
                return m.setClickable(marker.clickable);
            });
        };
        MarkerManager$$1.prototype.addMarker = function (marker) {
            var markerPromise = this._mapsWrapper.createMarker({
                position: { lat: marker.latitude, lng: marker.longitude },
                label: marker.label,
                draggable: marker.draggable,
                icon: marker.iconUrl,
                opacity: marker.opacity,
                visible: marker.visible,
                zIndex: marker.zIndex,
                title: marker.title,
                clickable: marker.clickable
            });
            this._markers.set(marker, markerPromise);
        };
        MarkerManager$$1.prototype.getNativeMarker = function (marker) {
            return this._markers.get(marker);
        };
        MarkerManager$$1.prototype.createEventObservable = function (eventName, marker) {
            var _this = this;
            return rxjs_Observable.Observable.create(function (observer) {
                _this._markers.get(marker).then(function (m) {
                    m.addListener(eventName, function (e) {
                        return _this._zone.run(function () {
                            return observer.next(e);
                        });
                    });
                });
            });
        };
        return MarkerManager$$1;
    }();
    MarkerManager$1.decorators = [{ type: _angular_core.Injectable }];
    /** @nocollapse */
    MarkerManager$1.ctorParameters = function () {
        return [{ type: GoogleMapsAPIWrapper }, { type: _angular_core.NgZone }];
    };

    var __extends = window && window.__extends || function () {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var ClusterManager = function (_super) {
        __extends(ClusterManager, _super);
        function ClusterManager(_mapsWrapper, _zone) {
            var _this = _super.call(this, _mapsWrapper, _zone) || this;
            _this._mapsWrapper = _mapsWrapper;
            _this._zone = _zone;
            _this._clustererInstance = new Promise(function (resolver) {
                _this._resolver = resolver;
            });
            return _this;
        }
        ClusterManager.prototype.init = function (options) {
            var _this = this;
            this._mapsWrapper.getNativeMap().then(function (map) {
                var clusterer = new MarkerClusterer(map, [], options);
                _this._resolver(clusterer);
            });
        };
        ClusterManager.prototype.addMarker = function (marker) {
            var clusterPromise = this._clustererInstance;
            var markerPromise = this._mapsWrapper.createMarker({
                position: {
                    lat: marker.latitude,
                    lng: marker.longitude
                },
                label: marker.label,
                draggable: marker.draggable,
                icon: marker.iconUrl,
                opacity: marker.opacity,
                visible: marker.visible,
                zIndex: marker.zIndex,
                title: marker.title,
                clickable: marker.clickable
            }, false);
            Promise.all([clusterPromise, markerPromise]).then(function (_a) {
                var cluster = _a[0],
                    marker = _a[1];
                return cluster.addMarker(marker);
            });
            this._markers.set(marker, markerPromise);
        };
        ClusterManager.prototype.deleteMarker = function (marker) {
            var _this = this;
            var m = this._markers.get(marker);
            if (m == null) {
                // marker already deleted
                return Promise.resolve();
            }
            return m.then(function (m) {
                _this._zone.run(function () {
                    _this._clustererInstance.then(function (cluster) {
                        cluster.removeMarker(m);
                        _this._markers.delete(marker);
                    });
                });
            });
        };
        ClusterManager.prototype.clearMarkers = function () {
            return this._clustererInstance.then(function (cluster) {
                cluster.clearMarkers();
            });
        };
        ClusterManager.prototype.setGridSize = function (c) {
            this._clustererInstance.then(function (cluster) {
                cluster.setGridSize(c.gridSize);
            });
        };
        ClusterManager.prototype.setMaxZoom = function (c) {
            this._clustererInstance.then(function (cluster) {
                cluster.setMaxZoom(c.maxZoom);
            });
        };
        ClusterManager.prototype.setStyles = function (c) {
            this._clustererInstance.then(function (cluster) {
                cluster.setStyles(c.styles);
            });
        };
        ClusterManager.prototype.setZoomOnClick = function (c) {
            this._clustererInstance.then(function (cluster) {
                if (c.zoomOnClick !== undefined) {
                    cluster.zoomOnClick_ = c.zoomOnClick;
                }
            });
        };
        ClusterManager.prototype.setAverageCenter = function (c) {
            this._clustererInstance.then(function (cluster) {
                if (c.averageCenter !== undefined) {
                    cluster.averageCenter_ = c.averageCenter;
                }
            });
        };
        ClusterManager.prototype.setImagePath = function (c) {
            this._clustererInstance.then(function (cluster) {
                if (c.imagePath !== undefined) {
                    cluster.imagePath_ = c.imagePath;
                }
            });
        };
        ClusterManager.prototype.setMinimumClusterSize = function (c) {
            this._clustererInstance.then(function (cluster) {
                if (c.minimumClusterSize !== undefined) {
                    cluster.minimumClusterSize_ = c.minimumClusterSize;
                }
            });
        };
        ClusterManager.prototype.setImageExtension = function (c) {
            this._clustererInstance.then(function (cluster) {
                if (c.imageExtension !== undefined) {
                    cluster.imageExtension_ = c.imageExtension;
                }
            });
        };
        return ClusterManager;
    }(MarkerManager$1);
    ClusterManager.decorators = [{ type: _angular_core.Injectable }];
    /** @nocollapse */
    ClusterManager.ctorParameters = function () {
        return [{ type: GoogleMapsAPIWrapper }, { type: _angular_core.NgZone }];
    };

    /**
     * AgmMarkerCluster clusters map marker if they are near together
     *
     * ### Example
     * ```typescript
     * import { Component } from '@angular/core';
     *
     * @Component({
     *  selector: 'my-map-cmp',
     *  styles: [`
     *    agm-map {
     *      height: 300px;
     *    }
     * `],
     *  template: `
     *    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
     *      <agm-marker-cluster>
     *        <agm-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
     *        </agm-marker>
     *        <agm-marker [latitude]="lat2" [longitude]="lng2" [label]="'N'">
     *        </agm-marker>
     *      </agm-marker-cluster>
     *    </agm-map>
     *  `
     * })
     * ```
     */
    var AgmMarkerCluster = function () {
        function AgmMarkerCluster(_clusterManager) {
            this._clusterManager = _clusterManager;
        }
        /** @internal */
        AgmMarkerCluster.prototype.ngOnDestroy = function () {
            this._clusterManager.clearMarkers();
        };
        /** @internal */
        AgmMarkerCluster.prototype.ngOnChanges = function (changes) {
            if (changes['gridSize']) {
                this._clusterManager.setGridSize(this);
            }
            if (changes['maxZoom']) {
                this._clusterManager.setMaxZoom(this);
            }
            if (changes['styles']) {
                this._clusterManager.setStyles(this);
            }
            if (changes['zoomOnClick']) {
                this._clusterManager.setZoomOnClick(this);
            }
            if (changes['averageCenter']) {
                this._clusterManager.setAverageCenter(this);
            }
            if (changes['minimumClusterSize']) {
                this._clusterManager.setMinimumClusterSize(this);
            }
            if (changes['styles']) {
                this._clusterManager.setStyles(this);
            }
            if (changes['imagePath']) {
                this._clusterManager.setImagePath(this);
            }
            if (changes['imageExtension']) {
                this._clusterManager.setImageExtension(this);
            }
        };
        /** @internal */
        AgmMarkerCluster.prototype.ngOnInit = function () {
            this._clusterManager.init({
                gridSize: this.gridSize,
                maxZoom: this.maxZoom,
                zoomOnClick: this.zoomOnClick,
                averageCenter: this.averageCenter,
                minimumClusterSize: this.minimumClusterSize,
                styles: this.styles,
                imagePath: this.imagePath,
                imageExtension: this.imageExtension
            });
        };
        return AgmMarkerCluster;
    }();
    AgmMarkerCluster.decorators = [{ type: _angular_core.Directive, args: [{
            selector: 'agm-marker-cluster',
            providers: [ClusterManager, { provide: _agm_core.MarkerManager, useExisting: ClusterManager }, _agm_core.InfoWindowManager]
        }] }];
    /** @nocollapse */
    AgmMarkerCluster.ctorParameters = function () {
        return [{ type: ClusterManager }];
    };
    AgmMarkerCluster.propDecorators = {
        'gridSize': [{ type: _angular_core.Input }],
        'maxZoom': [{ type: _angular_core.Input }],
        'zoomOnClick': [{ type: _angular_core.Input }],
        'averageCenter': [{ type: _angular_core.Input }],
        'minimumClusterSize': [{ type: _angular_core.Input }],
        'styles': [{ type: _angular_core.Input }],
        'imagePath': [{ type: _angular_core.Input }],
        'imageExtension': [{ type: _angular_core.Input }]
    };

    var AgmJsMarkerClustererModule = function () {
        function AgmJsMarkerClustererModule() {}
        return AgmJsMarkerClustererModule;
    }();
    AgmJsMarkerClustererModule.decorators = [{ type: _angular_core.NgModule, args: [{
            imports: [_agm_core.AgmCoreModule],
            declarations: [AgmMarkerCluster],
            exports: [AgmMarkerCluster]
        }] }];
    /** @nocollapse */
    AgmJsMarkerClustererModule.ctorParameters = function () {
        return [];
    };

    // main modules

    exports.AgmJsMarkerClustererModule = AgmJsMarkerClustererModule;
    exports.AgmMarkerCluster = AgmMarkerCluster;
    exports.ClusterManager = ClusterManager;

    Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=js-marker-clusterer.umd.js.map
(function () {
    'use strict';

    angular
        .module('osmmapscongestionApp')
        .controller('LeafletMapsController', LeafletMapsController);

    LeafletMapsController.$inject = ['$scope', 'leafletData'];

    function LeafletMapsController($scope, leafletData) {

        var roundabout = {"type": "Feature",
            "properties": {
                "osm_id": 116568119.0,
                "access": null,
                "aerialway": null,
                "aeroway": null,
                "amenity": null,
                "area": null,
                "barrier": null,
                "bicycle": null,
                "brand": null,
                "bridge": null,
                "boundary": null,
                "building": null,
                "covered": null,
                "culvert": null,
                "cutting": null,
                "disused": null,
                "embankment": null,
                "foot": null,
                "harbour": null,
                "highway": "primary",
                "historic": null,
                "horse": null,
                "junction": "roundabout",
                "landuse": null,
                "layer": null,
                "leisure": null,
                "lock": null,
                "man_made": null,
                "military": null,
                "motorcar": null,
                "name": null,
                "natural": null,
                "oneway": null,
                "operator": null,
                "population": null,
                "power": null,
                "place": null,
                "railway": null,
                "ref": "DN28D",
                "religion": null,
                "route": null,
                "service": null,
                "shop": null,
                "sport": null,
                "surface": "asphalt",
                "toll": null,
                "tourism": null,
                "tower:type": null,
                "tracktype": null,
                "tunnel": null,
                "water": null,
                "waterway": null,
                "wetland": null,
                "width": null,
                "wood": null,
                "z_order": 7.0,
                "way_area": null,
                "tags": "\"lanes\"=>\"1\", \"maxspeed\"=>\"90\""
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [[27.4867885, 47.1609141], [27.4867511, 47.1609454], [27.4867015, 47.1609618], [27.4866498, 47.1609679], [27.4865877, 47.1609619], [27.4865312, 47.1609405], [27.4864917, 47.1609083], [27.4864735, 47.1608757], [27.4864722, 47.1608265], [27.4864936, 47.1607889], [27.4865392, 47.1607516], [27.4866224, 47.1607329], [27.4867069, 47.1607384], [27.4867686, 47.1607682], [27.4867978, 47.1607962], [27.4868153, 47.1608352], [27.4868108, 47.1608825], [27.4867885, 47.1609141]]
            }
        };

        angular.extend($scope, {
            center: {
                autoDiscover: true
            },
            overlays: {
                search: {
                    name: 'search',
                    type: 'group',
                    visible: true,
                    layerParams: {
                        showOnSelector: false
                    }
                }
            }
        });

        leafletData.getLayers().then(function (baselayers) {
            console.log(baselayers.overlays.search);
            angular.extend($scope.controls, {
                search: {
                    layer: baselayers.overlays.search
                }
            });
        });

        leafletData.getMap().then(function (map) {
            map.addControl(new L.Control.Search({
                url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat', 'lon'],
                circleLocation: false,
                markerLocation: false,
                autoType: false,
                autoCollapse: true,
                minLength: 2,
                zoom: 10
            }));

            L.geoJson(roundabout).addTo(map);
        });


    }
})();

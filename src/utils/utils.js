/** @namespace Utils */

/** Function to refresh components based on their props. 
* @method 
* @memberof Utils 
*/
export function refreshComponentFromProps() {
	if(!this)
		throw new Error("You must bind this function to a react component to call it.");

    var properties = Object.getOwnPropertyNames(this.props);
    properties.forEach(prop => {
        if( prop != 'ref' &&
        	prop != 'key' &&
        	typeof this.props[prop] !== 'function' && 
            typeof this.props[prop] !== 'undefined' &&
            typeof this[prop + "PropDidChange"] === 'function'
            ) 
        {
            if(this[prop + "PropDidChange"]() && typeof this[prop+"HandleChange"] === 'function')
                this[prop + "HandleChange"]()

        }
    });
}

export function isValidMapListener(prop = "") {
	prop = prop.toLowerCase();
	switch(prop) {
 		case "bounds_changed": 
 		case "center_changed": 
 		case "click": 
 		case "dblclick": 
 		case "drag": 
 		case "dragend": 
 		case "dragstart": 
 		case "heading_changed": 
 		case "idle": 
 		case "maptypeid_changed": 
 		case "mousemove": 
 		case "mouseout": 
 		case "mouseover": 
 		case "projection_changed": 
 		case "resize": 
 		case "rightclick": 
 		case "tilesloaded": 
 		case "tilt_changed": 
 		case "zoom_change": 
 			return true;
 		default:
 			return false;
	}
}
/** Import these Map Control positions by `import {ControlPosition} from 'google-react-maps'`
* @enum ControlPosition
* @memberof Map
* @property {enum} BOTTOM_CENTER
* @property {enum} BOTTOM_LEFT
* @property {enum} BOTTOM_RIGHT
* @property {enum} LEFT_BOTTOM
* @property {enum} LEFT_CENTER
* @property {enum} LEFT_TOP
* @property {enum} RIGHT_BOTTOM
* @property {enum} RIGHT_CENTER
* @property {enum} RIGHT_TOP
* @property {enum} TOP_CENTER
* @property {enum} TOP_LEFT
* @property {enum} TOP_RIGHT
*/
export const ControlPosition = {
	BOTTOM_CENTER : "BOTTOM_CENTER",
	BOTTOM_LEFT : "BOTTOM_LEFT",
	BOTTOM_RIGHT : "BOTTOM_RIGHT",
	LEFT_BOTTOM : "LEFT_BOTTOM",
	LEFT_CENTER : "LEFT_CENTER",
	LEFT_TOP : "LEFT_TOP",
	RIGHT_BOTTOM : "RIGHT_BOTTOM",
	RIGHT_CENTER : "RIGHT_CENTER",
	RIGHT_TOP : "RIGHT_TOP",
	TOP_CENTER : "TOP_CENTER",
	TOP_LEFT : "TOP_LEFT",
	TOP_RIGHT : "TOP_RIGHT"
}
//License for the GeoJSON function:

// Copyright (c) 2012, Jason Sanford
// All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:

//     1. Redistributions of source code must retain the above copyright notice, this list of
//        conditions and the following disclaimer.
    
//     2. Redistributions in binary form must reproduce the above copyright notice, this list
//        of conditions and the following disclaimer in the documentation and/or other materials
//        provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
// TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

//End Liscense for the GeoJSON function
export const GeoJSON = function( geojson, options ){

	var _geometryToGoogleMaps = function( geojsonGeometry, options, geojsonProperties ){
		
		var googleObj, opts = _copy(options);
		
		switch ( geojsonGeometry.type ){
			case "Point":
				opts.position = new maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
				googleObj = new maps.Marker(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPoint":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					opts.position = new maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
					googleObj.push(new maps.Marker(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "LineString":
				var path = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var coord = geojsonGeometry.coordinates[i];
					var ll = new maps.LatLng(coord[1], coord[0]);
					path.push(ll);
				}
				opts.path = path;
				googleObj = new maps.Polyline(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiLineString":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var coord = geojsonGeometry.coordinates[i][j];
						var ll = new maps.LatLng(coord[1], coord[0]);
						path.push(ll);
					}
					opts.path = path;
					googleObj.push(new maps.Polyline(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "Polygon":
				var paths = [];
				var exteriorDirection;
				var interiorDirection;
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var ll = new maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
						path.push(ll);
					}
					if(!i){
						exteriorDirection = _ccw(path);
						paths.push(path);
					}else if(i == 1){
						interiorDirection = _ccw(path);
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}else{
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}
				}
				opts.paths = paths;
				googleObj = new maps.Polygon(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPolygon":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var paths = [];
					var exteriorDirection;
					var interiorDirection;
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var path = [];
						for (var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++){
							var ll = new maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
							path.push(ll);
						}
						if(!j){
							exteriorDirection = _ccw(path);
							paths.push(path);
						}else if(j == 1){
							interiorDirection = _ccw(path);
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}else{
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}
					}
					opts.paths = paths;
					googleObj.push(new maps.Polygon(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "GeometryCollection":
				googleObj = [];
				if (!geojsonGeometry.geometries){
					googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
				}else{
					for (var i = 0; i < geojsonGeometry.geometries.length; i++){
						googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
					}
				}
				break;
				
			default:
				googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
		}
		
		return googleObj;
		
	};
	
	var _error = function( message ){
	
		return {
			type: "Error",
			message: message
		};
	
	};

	var _ccw = function( path ){
		var isCCW;
		var a = 0;
		for (var i = 0; i < path.length-2; i++){
			a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
		}
		if(a > 0){
			isCCW = true;
		}
		else{
			isCCW = false;
		}
		return isCCW;
	};
  
  var _copy = function(obj){
    var newObj = {};
    for(var i in obj){
      if(obj.hasOwnProperty(i)){
        newObj[i] = obj[i];
      }
    }
    return newObj;
  };
		
	var obj;
	
	var opts = options || {};
	
	switch ( geojson.type ){
	
		case "FeatureCollection":
			if (!geojson.features){
				obj = _error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
			}else{
				obj = [];
				for (var i = 0; i < geojson.features.length; i++){
					obj.push(_geometryToGoogleMaps(geojson.features[i].geometry, opts, geojson.features[i].properties));
				}
			}
			break;
		
		case "GeometryCollection":
			if (!geojson.geometries){
				obj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
			}else{
				obj = [];
				for (var i = 0; i < geojson.geometries.length; i++){
					obj.push(_geometryToGoogleMaps(geojson.geometries[i], opts));
				}
			}
			break;
		
		case "Feature":
			if (!( geojson.properties && geojson.geometry )){
				obj = _error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
			}else{
				obj = _geometryToGoogleMaps(geojson.geometry, opts, geojson.properties);
			}
			break;
		
		case "Point": case "MultiPoint": case "LineString": case "MultiLineString": case "Polygon": case "MultiPolygon":
			obj = geojson.coordinates
				? obj = _geometryToGoogleMaps(geojson, opts)
				: _error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
			break;
		
		default:
			obj = _error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");
	
	}
	
	return obj;
	
};

  /**
   * Process each point in a Geometry, regardless of how deep the points may lie.
   * @param {google.maps.Data.Geometry} geometry The structure to process
   * @param {function(google.maps.LatLng)} callback A function to call on each
   *     LatLng point encountered (e.g. Array.push)
   * @param {Object} thisArg The value of 'this' as provided to 'callback' (e.g.
   *     myArray)
   */
export const processPoints = (geometry, callback, thisArg) => {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach(function(g) {
        processPoints(g, callback, thisArg);
      });
    }
}
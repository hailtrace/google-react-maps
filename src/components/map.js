import React from 'react';
import ReactDom from 'react-dom';
import mapsapi from 'google-maps-api';
import {refreshComponentFromProps, isValidMapListener} from '../utils/utils';

/**
* See [Google Maps Javascript API]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference}
* @namespace google.maps
* @memberof google
*/

/**
* See [LatLngLiteral object specification]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference#LatLngLiteral}
* @class google.maps.LatLngLiteral
* @memberof google.maps
* 
* @property {number} lat
* @property {number} lng
*/

/**
* The Map Component in the root component for the google maps library. It handles the interface between the google maps javascript api and the implementation of the other components.
* @class Map
*
* @property {string} api-key Required. The javascript api key from your [google console]{@link http://console.developer.google.com}.
* @property {object} mapOptions Optional. A google.maps.MapOptions object.
*
* @property {object} props
* @property {number} props.zoom
* @property {google.maps.LatLngLiteral} props.center
* @property {object} props.latLngBounds 
* @property {google.maps.LatLngLiteral} props.latLngBounds.sw
* @property {google.maps.LatLngLiteral} props.latLngBounds.ne
*/
class Map extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Map';
        

        var _div_id = "map_div_" + Math.floor(Date.now() * Math.random()).toString();
        /** 
        *   @property {object} state The Map component's internal state.
        *   @property {object} state.maps A google maps javascript api reference.
        *   @property {object} state._div_id The div id of this map.
        */
        this.state = {
        	maps : null,
            map : null,
        	_div_id
        }
        this.listeners = [];
        
        this.getGeocoder = this.getGeocoder.bind(this);
        this.getGoogleMapsApi = this.getGoogleMapsApi.bind(this);
        this.getGoogleMap = this.getGoogleMap.bind(this);

        this.getOptions = this.getOptions.bind(this);

        this.refreshComponentFromProps = refreshComponentFromProps.bind(this);

        this.centerPropDidChange = this.centerPropDidChange.bind(this);
        this.boundsPropDidChange = this.boundsPropDidChange.bind(this);
        this.zoomPropDidChange = this.zoomPropDidChange.bind(this);

        this.addListener = this.addListener.bind(this);
        this.removeListeners = this.removeListeners.bind(this);

        this.setupMapListenerHooks = this.setupMapListenerHooks.bind(this);
    }
    /** Gets the instance of the geocoder tied to this google map. */
    getGeocoder() {
        return this.state.geocoder;
    }
    /** Gets the google maps api reference from within the component. (Could be used to do google maps api stuff outside of the component) */
    getGoogleMapsApi() {
        return this.state.maps;
    }
    /** Gets the google maps instance created by `new maps.Map()` keyword. */
    getGoogleMap() {
        return this.state.map;
    }
    getOptions(maps) {
        var mapOptions = {
            zoom : 4,
            mapTypeId : maps.MapTypeId[!this.props.mapType? "ROADMAP" : this.props.mapType],
            data : null
        }
        
        if(this.props.optionsConstructor)
            mapOptions = Object.assign(mapOptions, new this.props.optionsConstructor(maps));

        return mapOptions;
    }
    centerPropDidChange() {
        var {maps,map} = this.state;
        var {center} = this.props;
        if(center)
            return !new maps.LatLng(center.lat,center.lng).equals(map.getCenter());
        else
            return false;
    }
    centerHandleChange() {
        this.state.map.setCenter(this.props.center);
    }
    boundsPropDidChange() {
        var {bounds} = this.props;
        return bounds ? !this.state.map.getLatLngBounds().equals(bounds) : false;
    }
    boundsHandleChange() {
        //TODO: Handle bounds change.
    }
    zoomPropDidChange() {
        var {map} = this.state;
        var {zoom} = this.props;
        return typeof zoom !== 'undefined' ? (zoom != map.getZoom()) : false;
    }
    zoomHandleChange() {
        var {map} = this.state;
        var {zoom} = this.props;
        try {
            console.log("MC : Setting Zoom", zoom, map);
            map.setZoom(zoom);        
        }
        catch(e) {
            console.error(e);
        }
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    removeListeners() {
        while(this.listeners.length > 0) {
            this.listeners.pop().remove();
        }
    }
    setupMapListenerHooks() {
        var {maps, map} = this.state;
        if(maps && map) {
            this.removeListeners();
            var assemble = (name, callback) => this.addListener(maps.event.addListener(map, name, callback));
            var props = Object.getOwnPropertyNames(this.props);

            props.forEach(prop => {
                if(/^on.*$/.test(prop)) {
                    var action = prop.slice(2, prop.length);
                    if(isValidMapListener(action)) {

                        assemble(action.toLowerCase(), this.props[prop])

                    }
                    else {
                        console.warn(new Error("You tried adding " + prop + " which is not a valid action for a <Map /> component."));
                    }

                }
            });
        }
    }
    componentDidMount() {
        console.log("MC : Component did mount.");

    	var initMapComponentWithLibrary = (maps) => {

    		window.maps = maps;
    		var mapOptions = this.getOptions(maps);            
            try {

                var geocoder = new maps.Geocoder();
        		var map = new maps.Map( ReactDom.findDOMNode(this.refs.map) , mapOptions);

                map.setCenter(!this.props.center? new maps.LatLng(39.5, -98.35) : new maps.LatLng(this.props.center.lat,this.props.center.lng));
            }
            catch(e) {
                console.error(e);
            }
            this.setState({
                map,
                maps,
                geocoder
            }, this.refreshComponentFromProps);
            this.setupMapListenerHooks();
    	}

    	if(this.props["api-key"]) {
    		if(!window.maps)
		    	mapsapi(this.props["api-key"], ['drawing','geometry','places'])().then(initMapComponentWithLibrary);
		    else
		    	initMapComponentWithLibrary(window.maps);
    	}
    }
    componentDidUpdate() {
        console.log("MC: Component Did Update");
        if(this.state.map) {
            this.refreshComponentFromProps();
            this.setupMapListenerHooks();
        }
    }
    componentWillUnmount() {
          this.removeListeners();
    }
    render() {
    	var children = [];
    	var controls = [];

        if(this.state.maps && this.state.map && this.props.children) 
	    	children = React.Children.map(this.props.children, child => child ? React.cloneElement(child, {
	    		maps : this.state.maps,
	    		map : this.state.map
	    	}) : undefined );

        if(this.state.maps && this.state.map && this.props.controls && this.props.controls.constructor.name === 'Array') {
            controls = React.Children.map(this.props.controls, control => control ? React.cloneElement(control, {
                maps : this.state.maps,
                map : this.state.map
            }) : undefined ); 

        }
        
        return <div ref="map" id={this.state._div_id} style={this.props.style}>
        	<div>{children}</div>
            <div>{controls}</div>

        </div>;
    }
}

Map.propTypes = {
    optionsConstructor : React.PropTypes.func,
	"api-key" : React.PropTypes.string.isRequired,
	style : React.PropTypes.object,
    mapType : React.PropTypes.string,
    zoom : React.PropTypes.number,
    center : React.PropTypes.shape({
        lat : React.PropTypes.number,
        lng : React.PropTypes.number
    }),
    bounds : React.PropTypes.shape({
        sw : React.PropTypes.shape({
            lat : React.PropTypes.number,
            lng : React.PropTypes.number
        }),
        ne : React.PropTypes.shape({
            lat : React.PropTypes.number,
            lng : React.PropTypes.number
        }) 
    })
}

export default Map;

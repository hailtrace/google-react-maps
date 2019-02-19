import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
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
* @property {function} props.onMount callback(map, maps) Get's called right after the component is done it's initial render. (Key for triggering outside events that require google maps api to be instantiated.)
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
        this.ref = this.ref.bind(this);
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
        const center = this.state.map.getCenter();
        if(this.props.center.lat != center.lat && this.props.center.lng != center.lng) {
            this.state.map.setCenter(this.props.center);
        }
    }
    boundsPropDidChange() {
        var {bounds} = this.props;
        if(bounds && bounds.sw && bounds.ne) {
            bounds = new this.state.maps.LatLngBounds(bounds.sw, bounds.ne);
        }
        const mapBounds = this.state.map.getBounds();

        return bounds && mapBounds ? !mapBounds.equals(bounds) : false;
    }
    boundsHandleChange() {
        var {bounds} = this.props;
        if(bounds && bounds.sw && bounds.ne) {
            bounds = new this.state.maps.LatLngBounds(bounds.sw, bounds.ne);
            this.state.map.panToBounds(bounds);
        }
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
                    var action = prop.slice(2, prop.length); //Remove the 'on' in front of the prop-name.
                    if(isValidMapListener(action)) {
                        switch(action.toLowerCase()) {
                            case 'bounds_changed':case 'boundschanged':

                                assemble('bounds_changed', event => {
                                    const bounds = map.getBounds()? {ne : map.getBounds().getNorthEast().toJSON(), sw : map.getBounds().getSouthWest().toJSON()} : null;
                                    this.props[prop](bounds, event)
                                });
                                break;
                            case 'center_changed':case 'centerchanged':
                                assemble('center_changed', event => {
                                    const center = map.getCenter();
                                    this.props[prop](center, event);
                                });
                                break;
                            case 'zoom_changed':case 'zoomchanged':
                                assemble('zoom_changed', event => {
                                    const zoom = map.getZoom();
                                    this.props[prop](zoom, event);
                                });

                            default:
                                assemble(action.toLowerCase(), this.props[prop]);
                                break;
                        }
                    }
                    else {
                        if(action.toLowerCase() !== 'mount') {
                            console.warn(new Error("You tried adding " + prop + " which is not a valid action for a <Map /> component."));
                        }
                    }

                }
            });
        }
    }
    ref(name) {
      return (item) => {
        this[name] = item;
      };
    }
    componentDidMount() {


    	var initMapComponentWithLibrary = (maps) => {

    		// window.maps = maps;
    		var mapOptions = this.getOptions(maps);
            try {

                var geocoder = new maps.Geocoder();
        		var map = new maps.Map( ReactDom.findDOMNode(this.mapDiv) , mapOptions);

                map.setCenter(!this.props.center? new maps.LatLng(39.5, -98.35) : new maps.LatLng(this.props.center.lat,this.props.center.lng));
                if(this.props.bounds && this.props.bounds.sw && this.props.bounds.ne) {
                    const bounds = new maps.LatLngBounds(this.props.bounds.sw, this.props.bounds.ne);
                    map.panToBounds(bounds);
                }
            }
            catch(e) {
                console.error(e);
            }
            this.setState({
                map,
                maps,
                geocoder
            }, () => {
                this.refreshComponentFromProps();
                if(typeof this.props.onMount === 'function') {
                    this.props.onMount(this.getGoogleMap(), this.getGoogleMapsApi());
                }
            });

            this.setupMapListenerHooks();
    	}

    	if(this.props["api-key"]) {
        const mapsapi = require('google-maps-api');
    		// if(!window.maps)
		    	mapsapi(this.props["api-key"], ['drawing','geometry','places'])().then(initMapComponentWithLibrary);
		    // else
		    // 	initMapComponentWithLibrary(window.maps);
    	}
    }
    componentDidUpdate() {

        if(this.state.map) {
            this.refreshComponentFromProps();
            this.setupMapListenerHooks();// ?? This may not be necessary. Only on didMount.
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

        return <div ref={this.ref('mapDiv')} id={this.state._div_id} style={this.props.style}>
        	<div>{children}</div>
            <div>{controls}</div>

        </div>;
    }
}

Map.propTypes = {
    didMount : PropTypes.func,
    optionsConstructor : PropTypes.func,
	"api-key" : PropTypes.string.isRequired,
	style : PropTypes.object,
    mapType : PropTypes.string,
    zoom : PropTypes.number,
    center : PropTypes.shape({
        lat : PropTypes.number,
        lng : PropTypes.number
    }),
    bounds : PropTypes.shape({
        sw : PropTypes.shape({
            lat : PropTypes.number,
            lng : PropTypes.number
        }),
        ne : PropTypes.shape({
            lat : PropTypes.number,
            lng : PropTypes.number
        })
    })
}

export default Map;

import React from 'react';
import mapsapi from 'google-maps-api';
import {refreshComponentFromProps} from '../utils/utils';

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
        	_div_id
        }

        this.getOptions = this.getOptions.bind(this);

        this.refreshComponentFromProps = refreshComponentFromProps.bind(this);

        this.centerPropDidChange = this.centerPropDidChange.bind(this);
        this.boundsPropDidChange = this.boundsPropDidChange.bind(this);
        this.zoomPropDidChange = this.zoomPropDidChange.bind(this);

    }
    getOptions() {
        var mapOptions = {
            zoom : 4,
            mapTypeId : maps.MapTypeId[!this.props.mapType? "ROADMAP" : this.props.mapType],
            data : null
        }
        
        if(this.props.mapOptions)
            mapOptions = Object.assign(mapOptions, this.props.mapOptions);

        return mapOptions;
    }
    centerPropDidChange() {
        var {maps,map} = this.state;
        var {center} = this.props;
        if(center)
            return !new maps.LatLng(center.lat,center.lng).equals(map.getCenter());
        else
            return true;
    }
    centerHandleChange() {
        this.state.maps.setCenter(this.props.center);
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

    componentDidMount() {
        console.log("MC : Component did mount.");

    	var initMapComponentWithLibrary = (maps) => {

    		window.maps = maps;
    		var mapOptions = this.getOptions();            
            try {
        		var map = new maps.Map( document.getElementById(this.state._div_id) , mapOptions);

                map.setCenter(!this.props.center? new maps.LatLng(39.5, -98.35) : new maps.LatLng(this.props.center.lat,this.props.center.lng));
            }
            catch(e) {
                console.error(e);
            }
            this.setState({
                map,
                maps
            }, this.refreshComponentFromProps);

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
        this.refreshComponentFromProps();
    }
    render() {
    	var children = [];
    	if(this.state.maps && this.state.map && this.props.children) 
	    	children = React.Children.map(this.props.children, child => child ? React.cloneElement(child, {
	    		maps : this.state.maps,
	    		map : this.state.map
	    	}) : undefined );

        return <div id={this.state._div_id} style={this.props.style}>
        	{children}
        </div>;
    }
}

Map.propTypes = {
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

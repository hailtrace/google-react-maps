import React from 'react';
import mapsapi from 'google-maps-api';

/**
* The Map Component in the root component for the google maps library. It handles the interface between the google maps javascript api and the implementation of the other components.
* @class Map
*
* @property {string} api-key Required. The javascript api key from your [google console]{@link http://console.developer.google.com}.
* @property {object} mapOptions Optional. A google.maps.MapOptions object.
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
    }
    componentDidMount() {
    	var initMapComponentWithLibrary = (maps) => {
    		window.maps = maps;

			this.setState({maps}, () => {
	    		var mapOptions = {
	    			zoom : 4,
	    			mapTypeId : maps.MapTypeId.ROADMAP,
	    			center : new maps.LatLng(39.5, -98.35),
	    			data : null
	    		}
	    		
	    		if(this.props.mapOptions)
	    			mapOptions = this.props.mapOptions;

	    		var map = new maps.Map( document.getElementById(this.state._div_id) , mapOptions);

	    		this.setState({
	    			map,
	    		});
	    	});
    	}

    	if(this.props["api-key"]) {
    		if(!window.maps)
		    	mapsapi(this.props["api-key"], ['drawing','geometry','places'])().then(initMapComponentWithLibrary);
		    else
		    	initMapComponentWithLibrary(window.maps);
    	}
    }
    render() {
    	var children;
    	if(this.state.maps && this.state.map) 
	    	children = React.Children.map(this.props.children, child => React.cloneElement(child, {
	    		maps : this.state.maps,
	    		map : this.state.map
	    	}));

        return <div id={this.state._div_id} style={this.props.style}>
        	{children}
        </div>;
    }
}

Map.propTypes = {
	"api-key" : React.PropTypes.string.isRequired,
	style : React.PropTypes.object
}

export default Map;

import React from 'react';
import mapsapi from 'google-maps-api';
import maps from '../../test-data/feature-collections.js';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Map';
        

        var _div_id = "map_div_" + Math.floor(Date.now() * Math.random()).toString();
        this.state = {
        	maps : null,
        	children : [],
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

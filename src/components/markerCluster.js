import React from 'react';
import MarkerClusterer from 'marker-clusterer-plus';
/**
* Clusters `<Marker />` components passed as children in props.children

* @memberof Map
*
* @property {object} props
* @property {object} props.map The google.maps.Map object from the map component.
* @property {Array.<Map.Marker>} props.children These should only be {@link Marker} components.
* @property {MarkerClustererOptions} props.options The MarkerClusterer instantiates with these options.
* @property {object} state The state of the MarkerCluster component.
* @property {MarkerClusterer} state.MarkerClusterer The instance of {@link MarkerClusterer} for this component.
*
*
*/
class MarkerCluster extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'MarkerCluster';
        this.state = {
        	MarkerClusterer : null
        }
    }
    componentDidMount() {
    	if(this.props.map && this.props.maps) {
	    	var options = {gridSize: 50, maxZoom: 15}

	    	if(this.props.options)
	    		options = Object.assign(options, this.props.options);

	    	this.setState({
	    		MarkerClusterer : new MarkerClusterer(this.props.map, [], options)
	    	});
    	}
    	else {
    		console.error(new Error("You must run <MarkerCluster /> components within the context of a <Map /> component. Otherwise, provide the maps and map props manually."));
    	}
    }
    componentWillUnmount() {
    	var {MarkerClusterer} = this.state;
    	if(MarkerClusterer) {
    		MarkerClusterer.removeMarkers(MarkerClusterer.getMarkers());
    	}
	    this.setState({MarkerClusterer : null})
    }
    render() {
    	var children = [];
    	var {map, maps} = this.props;
    	if(this.props.map && this.props.maps)
	    	children = React.Children.map(this.props.children, child => React.cloneElement(child, {
	    		MarkerClusterer : this.state.MarkerClusterer,
	    		map,
	    		maps
	    	}))
        return <div>{children}</div>;
    }
}

MarkerCluster.propTypes = {
	map : React.PropTypes.object,
	maps : React.PropTypes.object,
	options : React.PropTypes.object
}

export default MarkerCluster;

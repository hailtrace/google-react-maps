import React from 'react';

/**
* The component designed to implement the google.maps.Marker from the javascript api. <Marker /> components live within the context of any <Map /> component.
* @memberof Map
* @property {object} state
* @property {google.maps.Marker} state.Marker
* @property {object} props
* @property {google.maps.Map} props.map
* @property {google.maps} props.maps
* @property {object} props.coords Defines the coordinate pair where this marker should exits.
* @property {number} props.coords.lng Number defining longitude.
* @property {number} props.coords.lat Number defining latitude.
* @property {string|Icon} props.icon
* @property {google.maps.MarkerOptions} props.options See [Marker Options Documentation]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions}
*/
class Marker extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Marker';
        this.state = {
        	marker : null
        }

        this.getOptions = this.getOptions.bind(this);
    }
    componentWillMount() {
    	if(this.props.map && this.props.maps) {
    		var {map,maps, MarkerClusterer} = this.props;

    		var marker = new maps.Marker(this.getOptions());

    		marker.setMap(this.props.map);

    		this.setState({marker});

    		if(MarkerClusterer)
    			MarkerClusterer.addMarker(marker);

    		if(typeof this.props.onClick === 'function')
	    		this.props.maps.event.addListener(marker, 'click', e => {
	    			if(this.props.onClick)
	    				this.props.onClick({coords : marker.getPosition().toJSON()})
	    		});
        if(typeof this.props.onDragEnd === 'function')
          this.props.maps.event.addListener(marker, 'dragend', e=> {
            this.props.onDragEnd(e.latLng.toJSON(), e);
          })
    	}
    	else {
    		// Whoah boy! We need a map bigly.
    		console.error(new Error("<Marker /> components must be instantiated within a Map component. Please check your component's context."))
    	}
    }
    componentWillUpdate() {

    }
    getOptions() {
		var options = {
			position : this.props.coords,
			// map : this.props.map,
			icon : this.props.icon ? this.props.icon : undefined
		}
		if(this.props.options)
			options = Object.assign(options, this.props.options);
    	return options;
    }
    componentWillUnmount() {
		if(this.state.marker) {
			this.state.marker.setMap(null);
		}
		this.setState({marker : null});

    }
    componentDidUpdate(prevProps, prevState) {
    	if(this.state.marker) {
    		this.state.marker.setOptions(this.getOptions())
    	}
    }
    render() {
    	var children = [];
    	if(this.props.children)
    		children = React.Children.map(this.props.children, child => React.cloneElement(child, {
    			map : this.props.map,
    			maps : this.props.maps,
    			anchor : this.state.marker
    		}));
        return <div>{children}</div>;
    }
}

Marker.propTypes = {
	maps : React.PropTypes.object,
	map : React.PropTypes.object,
	MarkerClusterer : React.PropTypes.object,
	options : React.PropTypes.object,
	anchor : React.PropTypes.object,
	coords : React.PropTypes.shape({
		lng : React.PropTypes.number,
		lat : React.PropTypes.number
	})
}

export default Marker;

import React from 'react';

/** Defines a circle shape in the map. Relates to google.maps.Circle class. 
* @property {object} props
* @property {number} props.radius
* @property {object} props.center
* @property {number} props.center.lat
* @property {number} props.center.lng
* @property {function} props.onRadiusChange
* @property {function} props.onCenterChange

*/
class Circle extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Circle';
        this.setupListeners = this.setupListeners.bind(this);
        this.state = {circle : null};

        this.focus = this.focus.bind(this);
    }
    /** Focus the map on this circle. */
    focus() {
    	var {circle} = this.state;
    	var {map} = this.state;
    	if(circle && map) {
    		map.fitBounds(circle.getBounds());
    	}
    }
    /** Setup the listeners for this circle */
    setupListeners() {
    	var {circle} = this.state;
    	var {maps, map} = this.state;
    	if(maps && circle) {
    		maps.event.addListener(circle, 'radius_changed',e => {
    			if(typeof this.onRadiusChange === 'function')
    				this.onRadiusChange({radius : circle.getRadius()});
    		})
    		maps.event.addListener(circle, 'dragend', e => {
    			if(typeof this.onCenterChange === 'function')
    				this.onCenterChange({coords: circle.getCenter().toJSON()});
    		})
    	}
    }
    componentWillMount() {
    	var {
    		map, 
    		maps,
    		center,
    		clickable,

    	} = this.props;
    	
    	if(map && maps) {
    		var CircleOptions = Object.assign({}, this.props, {maps : undefined});
    		var circle = new maps.Circle(CircleOptions);
    		this.setState({circle}, this.setupListeners);
    	}
    }
    componentWillUnmount() {
       if(this.state.circle) {
            this.props.maps.clearListeners(this.state.circle);
       		this.state.circle.setMap(null);
       }
    }
    render() {
        return <div>Circle</div>;
    }
}

var {number, shape} = React.PropTypes;

Circle.propTypes = {
	radius : number.isRequired,
	center : shape({
		lat : number,
		lng : number
	}).isRequired
}
export default Circle;

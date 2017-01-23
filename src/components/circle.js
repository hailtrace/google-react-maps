import React from 'react';
import {mapChildren} from '../utils/utils';
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
    	var {maps, map} = this.props;
    	if(maps && circle) {
    		maps.event.addListener(circle, 'radius_changed',e => {
    			if(typeof this.props.onRadiusChange === 'function')
    				this.props.onRadiusChange(circle.getRadius());
    		});
    		maps.event.addListener(circle, 'center_changed', e => {
    			if(typeof this.props.onCenterChange === 'function')
    				this.props.onCenterChange(circle.getCenter().toJSON());
    		});
    		maps.event.addListener(circle, 'click', e => {
    			if(typeof this.props.onClick === 'function')
    				this.props.onClick(Object.assign({coords : circle.getCenter().toJSON()},e));
    		});
    		maps.event.addListener(circle, 'rightclick', ({latLng}) =>
    			typeof this.props.onRightClick === 'function' ? this.props.onRightClick({coords:latLng.toJSON()}) : f => f);
    	}
    	else
    		console.error(new Error("You must pass maps and map to this component. Otherwise, run it inside a map component."));
    }
    componentDidUpdate(prevProps, prevState) {
    	var currCenter = new this.props.maps.LatLng(this.props.center);
    	var prevCenter = this.state.circle.getCenter();

    	if(!currCenter.equals(prevCenter))
    		this.state.circle.setCenter(currCenter);

    	if(this.props.radius != this.state.circle.getRadius())
    		this.state.circle.setRadius(this.props.radius);
    }
    componentWillMount() {
    	var {
    		map,
    		maps,
    	} = this.props;

    	if(map && maps) {
    		var CircleOptions = Object.assign({}, this.props, {maps : undefined});
    		var circle = new maps.Circle(CircleOptions);
    		this.setState({circle}, this.setupListeners);
    	}
    }
    componentWillUnmount() {
       if(this.state.circle) {
            this.props.maps.event.clearListeners(this.state.circle);
       		this.state.circle.setMap(null);
       }
    }
    render() {
    	var children = [];
    	if(this.props.children && this.props.maps && this.props.map)
    		children = mapChildren({
    			coords : this.state.circle.getCenter().toJSON()
    		}, this);
        return <div>{children}</div>;
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

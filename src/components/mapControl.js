import React from 'react';
import ReactDom from 'react-dom';
import {ControlPosition} from '../utils/utils';
/**
* The component that defines a custom map control at a predifined position.
* 
* @property {object} props
* @property {google.maps.Map} props.map
* @property {google.maps} props.maps
* @property {string} props.position
* @property {number} props.index
*/
class MapControl extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'MapControl';
        this.cleanMapControlContent = this.cleanMapControlContent.bind(this);
    }
    cleanMapControlContent() {
    	var parent = ReactDom.findDOMNode(this.refs.controlParent);
    	var child = ReactDom.findDOMNode(this.refs.controlChildren);
    	parent.appendChild(child);
    }
    loadMapControlContent() {
    	var {maps, map, position} = this.props;
    	var children = ReactDom.findDOMNode(this.refs.controlChildren);
    	children.index = typeof this.props.index !== 'undefined' ? this.props.index : 1;

		if(position && map){
			map.controls[maps.ControlPosition[position]].push(children);
		}
		else
			console.warn("You must provide your map control a specific control position.");
    }
    componentWillMount() {

    }
    componentDidMount() {
    	this.loadMapControlContent();
    }
    componentDidUpdate() {
    }
    componentWillUnmount() {
    	 console.log("Component unmounting.")
          this.cleanMapControlContent();
    }
    render() {
        return <div ref="controlParent"><div ref="controlChildren">{this.props.children}</div></div>;
    }
}

MapControl.propTypes = {
	map : React.PropTypes.object,
	maps : React.PropTypes.object,
	position : React.PropTypes.oneOf(Object.getOwnPropertyNames(ControlPosition)).isRequired,
	index : React.PropTypes.number
}

export default MapControl;

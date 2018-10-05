import React from 'react';
import PropTypes from 'prop-types';
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
        this.ref = this.ref.bind(this);
    }
    cleanMapControlContent() {
    	var parent = ReactDom.findDOMNode(this.controlParent);
    	var child = ReactDom.findDOMNode(this.controlChildren);
    	parent.appendChild(child);
    }
    loadMapControlContent() {
    	var {maps, map, position} = this.props;
    	var children = ReactDom.findDOMNode(this.controlChildren);
    	children.index = typeof this.props.index !== 'undefined' ? this.props.index : 1;

		if(position && map){
			map.controls[maps.ControlPosition[position]].push(children);
		}
		else
			console.warn("You must provide your map control a specific control position.");
    }
    ref(name) {
      return (item) => {
        this[name] = item;
      };
    }
    componentWillMount() {

    }
    componentDidMount() {
    	this.loadMapControlContent();
    }
    componentDidUpdate() {
    }
    componentWillUnmount() {
      this.cleanMapControlContent();
    }
    render() {
        return <div ref={this.ref("controlParent")}><div ref={this.ref("controlChildren")}>{this.props.children}</div></div>;
    }
}

MapControl.propTypes = {
	map : PropTypes.object,
	maps : PropTypes.object,
	position : PropTypes.oneOf(Object.getOwnPropertyNames(ControlPosition)).isRequired,
	index : PropTypes.number
}

export default MapControl;

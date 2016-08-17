import React from 'react';
import ReactDom from 'react-dom';

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SearchBox';
        this.state = {
        	searchBox : null
        }
    }
    componentDidMount() {
    	var {map, maps, position} = this.props;
    	if(map && maps) {
	    	var input = ReactDom.findDOMNode(this.refs.input);
	    	var container = ReactDom.findDOMNode(this.refs.child);
	    	var searchBox = new maps.places.SearchBox(input);
	    	
	    	this.setState({searchBox})

	    	map.addListener('bounds_changed', () => {
	            searchBox.setBounds(map.getBounds());
		    });

			searchBox.addListener('places_changed', () => {
               if(typeof this.props.onPlacesChanged === 'function')
	               this.props.onPlacesChanged(searchBox.getPlaces());
            });

	    	if(!position)
	    		position = "TOP_LEFT";

			map.controls[maps.ControlPosition[position]].push(container);

    	}
    	else
    		console.warn(new Error("You must pass this component as a control to a Map component."))
    }
    componentWillUnmount() {
          var child = ReactDom.findDOMNode(this.refs.child);
          var parent = ReactDom.findDOMNode(this.refs.parent);
          parent.appendChild(child);
    }
    render() {
    	var Wrapper = this.props.wrapper;
    	if(Wrapper)
    		return <div ref="parent"><div ref="child"><Wrapper><input type="text" ref="input" style={this.props.style} className={this.props.className} /></Wrapper></div></div>
    	else
	        return <div ref="parent"><div ref="child"><input type="text" ref="input" style={this.props.style} className={this.props.className} /></div></div>;
    }
}

SearchBox.PropTypes = {
	position : React.PropTypes.string.isRequired,
	wrapper : React.PropTypes.func,
	onPlacesChanged : React.PropTypes.func.isRequired
}

export default SearchBox;

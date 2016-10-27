import React from 'react';
import ReactDom from 'react-dom';

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SearchBox';
        this.state = {
        	searchBox : null,
        	internalPosition : -1
        }
        this.postRender = this.postRender.bind(this);
        this.preRender = this.preRender.bind(this);
    }
    componentDidMount() {
   	 this.postRender();
    }
    postRender() {
    	var {map, maps, position} = this.props;
    	if(map && maps) {
	    	var input = ReactDom.findDOMNode(this.refs.input);
	    	var container = ReactDom.findDOMNode(this.refs.child);
	    	var searchBox = new maps.places.SearchBox(input);
	    	


	    	map.addListener('bounds_changed', () => {
	            searchBox.setBounds(map.getBounds());
                this.props.onPlacesChanged(searchBox.getPlaces());
		    });

			searchBox.addListener('places_changed', () => {
               if(typeof this.props.onPlacesChanged === 'function')
	               this.props.onPlacesChanged(searchBox.getPlaces());
            });

	    	if(!position)
	    		position = "TOP_LEFT";

	    	if(this.state.internalPosition < 0)
				map.controls[maps.ControlPosition[position]].push(container);
			else
				map.controls[maps.ControlPosition[position]].insertAt(this.state.internalPosition, container);

			var internalPosition = map.controls[maps.ControlPosition[position]].length-1;

			if(this.state.internalPosition != internalPosition)
				this.setState({
					internalPosition
				});
    	}
    	else
    		console.warn(new Error("You must pass this component as a control to a Map component."))
    }
    preRender() {
    	var {map, maps, position} = this.props;
    	var {internalPosition} = this.state;
		map.controls[maps.ControlPosition[position]].removeAt(internalPosition);

		var child = ReactDom.findDOMNode(this.refs.child);
		var parent = ReactDom.findDOMNode(this.refs.parent);
		parent.appendChild(child);
    }
    componentWillUpdate() {
    	if(this.state.internalPosition > -1)
	    	this.preRender();
    }
    shouldComponentUpdate(nextProps, nextState) {
    	return false;
    }
    componentDidUpdate(prevProps, prevState) {
    	if(this.state.internalPosition > -1 && prevState.internalPosition != -1)
	    	this.postRender();
    }
    componentWillUnmount() {
   	 	this.preRender();
    }
    render() {
    	var Wrapper = this.props.wrapper;
    	if(Wrapper)
    		return <div ref="parent"><div ref="child"><Wrapper><input type="text" ref="input" placeholder={this.props.placeholder} style={this.props.style} className={this.props.className} /></Wrapper></div></div>
    	else
	        return <div ref="parent"><div ref="child"><input type="text" ref="input" placeholder={this.props.placeholder} style={this.props.style} className={this.props.className} /></div></div>;
    }
}

SearchBox.PropTypes = {
    placeholder : React.PropTypes.string,
	position : React.PropTypes.string.isRequired,
	wrapper : React.PropTypes.func,
	onPlacesChanged : React.PropTypes.func.isRequired
}

export default SearchBox;

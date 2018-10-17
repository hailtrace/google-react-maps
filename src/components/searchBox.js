import React from 'react';
import PropTypes from 'prop-types';
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
        this.ref = this.ref.bind(this);
        this.boundsListener = null;
        this.placesListener = null;
        this.timer = null;
    }
    componentDidMount() {
   	 this.postRender();
    }
    postRender() {
    	var {map, maps, position} = this.props;
    	if(map && maps) {
	    	var input = ReactDom.findDOMNode(this.input);
	    	var container = ReactDom.findDOMNode(this.child);
	    	var searchBox = new maps.places.SearchBox(input);

            this.timer = null;

            if(this.boundsListener)
                this.boundsListener.remove();
            if(this.placesListener)
                this.placesListener.remove();

	    	this.boundsListener = map.addListener('bounds_changed', () => {
                if(this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    const map_bounds = map.getBounds();
                    searchBox.setBounds(map_bounds);

                    if(typeof this.props.onPlacesChanged === 'function' && this.input) {
                        const query = this.input.value;
                        const service = new maps.places.PlacesService(map);
                        query ? service.textSearch({
                            query,
                            bounds: map_bounds
                        }, (places, status) => {
                            if(status == maps.places.PlacesServiceStatus.OK) {
                                this.props.onPlacesChanged(places);
                            }
                        }) : '';
                    }
                }, 5000);
		    });

			this.placesListener = searchBox.addListener('places_changed', () => {
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
    ref(name) {
      return (item) => {
        this[name] = item;
      };
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
    		return <div ref={this.ref('parent')}><div ref={this.ref('child')}><Wrapper><input type="text" ref={this.ref('input')} placeholder={this.props.placeholder} style={this.props.style} className={this.props.className} /></Wrapper></div></div>
    	else
	        return <div ref={this.ref('parent')}><div ref={this.ref('child')}><input type="text" ref={this.ref('input')} placeholder={this.props.placeholder} style={this.props.style} className={this.props.className} /></div></div>;
    }
}

SearchBox.propTypes = {
  placeholder : PropTypes.string,
	position : PropTypes.string.isRequired,
	wrapper : PropTypes.func,
	onPlacesChanged : PropTypes.func.isRequired
}

export default SearchBox;

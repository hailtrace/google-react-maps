import React from 'react';

class DataLayer extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'DataLayer';
        this.state = {
        	data : null
        }

        this.initDataLayer = this.initDataLayer.bind(this);

        //Prop Checking
        this.checkPropVisibility = this.checkPropVisibility.bind(this);

        //Style
        this.styleFeatures = this.styleFeatures.bind(this);
    }

    initDataLayer() {
    	var {map, maps} = this.props;

		var dataOptions = {
			map
     	}

     	if(this.props.dataOptions)
     		dataOptions = Object.assign(dataOptions, this.props.dataOptions);

     	dataOptions = Object.assign(dataOptions, {
     		style : this.styleFeatures,
     	})

     	var dataLayer = new maps.Data(dataOptions)

     	//If there is geoJSON, initialize it.
     	if(this.props.geoJson) {
     		var options = { idPropertyName : '_id' };
     		if(this.props.idPropertyName)
     			options.idPropertyName = this.props.idPropertyName;

     		dataLayer.addGeoJson(this.props.geoJson, options);
     	}

     	this.setState({ data : dataLayer })

    }

    checkPropVisibility(nextProps) {
    	var {visible} = this.props;

    	if(!visible && nextProps.visible) {
    		this.state.data.setMap(this.props.map);
    	}
    	else if(visible && !nextProps.visible)
    		this.state.data.setMap(null);
    }

    styleFeatures(feature) {
    	//If they passed in a function to completely overide style features, then do so.

    	if(this.props.styleFeatures)
    		return this.props.styleFeatures(feature);

        var geo = feature.getGeometry();
        var type = null;
        if(geo)
            type = geo.getType();

        var visible = feature.getProperty('visible');
        var zIndex = feature.getProperty('zIndex');
        var strokeColor = feature.getProperty('strokeColor');
        var fillColor = feature.getProperty('fillColor');
        var fillOpacity = this.props.fillOpacity;

        //Do some logic on the options to make things a bit easier.
        if(!strokeColor)
        	strokeColor = fillColor;

        zIndex = zIndex? zIndex : 10;

        if(this.props.zIndex)
        	zIndex = zIndex + (10000 * this.props.zIndex) //TODO: Find a better way to separate out layer zIndexes. Right now we are defautling to 10000K features in a GeoJson schema. It works, but there should be a better way.

        switch(type) {
        	case 'Polygon':
        		var polyOptions = {
        			strokeWeight : 1,
        			strokeColor,
        			fillColor,
        			fillOpacity
        		} //Potential Enhancement: Polyoptions could have different defaults. For now, we will leave this.
        		
        		if(typeof visible !== 'undefined')
        			polyOptions.visible = true;
        		if(typeof zIndex !== 'undefined');
        			polyOptions.zIndex = zIndex;
        		return polyOptions;
        	default:
	        	return {}
        }
    }
    componentWillMount() {
    	console.log("DL: componentWillMount",this.props)
		if(this.props.maps && this.props.map) {
			this.initDataLayer();
			this.checkPropVisibility(this.props);
		}
		else
			console.error(new Error("You must put this compenent in a <Map /> context component or provide the maps and map props manually."))
    }
    componentWillUnmount() {
    	console.log("DL: componentWillUnmount");
    	this.state.data.setMap(null);
    	this.setState({data : null})
    }
    componentDidUpdate(prevProps, prevState) {
   		console.log("DL: componentDidUpdate", prevProps,prevState);
    }
    componentWillReceiveProps(nextProps) {
    	console.log("DL: componentWillReceiveProps", nextProps, this.props);
    	if(typeof nextProps.visible !== 'undefined') {
	   		this.checkPropVisibility(nextProps);
    	}
    }
   	shouldComponentUpdate(nextProps, nextState) {
   		console.log("DL: shouldComponentUpdate", nextProps, nextState);
   		return true;
   	}
   	componentWillUpdate(nextProps, nextState) {
   	    console.log("DL: componentWillUpdate", nextProps, nextState);
   	}
    render() {
    	var children = []

    	if(this.state.data) {

	    	children = React.Children.map(this.props.children, child => React.cloneElement(child, {
	    		maps : this.props.maps,
	    		map : this.props.map,
	    		data : this.state.data
	    	}));
    	}
    	console.log("Rendered DataLayer");
        return <div>{children}</div>;
    }
}

DataLayer.propTypes = {
    maps : React.PropTypes.object,
    map : React.PropTypes.object,
    dataOptions : React.PropTypes.object,
    geoJson : React.PropTypes.object,
    visible : React.PropTypes.bool,
    onChange : React.PropTypes.func,
    styleFeatures : React.PropTypes.func,
    zIndex : React.PropTypes.number.isRequired,
    fillOpacity : React.PropTypes.number
}

export default DataLayer;

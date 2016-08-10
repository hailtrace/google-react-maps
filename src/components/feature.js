import React from 'react';
import {GeoJSON} from '../utils/utils';
window.GeoJSON = GeoJSON;

class Feature extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Feature';
        this.getDataFeature = this.getDataFeature.bind(this);
    	this.state = {
    		feature : null,
    		listeners : [],
    	}

    	this.addListener = this.addListener.bind(this);
    	//Check props.
    	this.checkPropEditable = this.checkPropEditable.bind(this);

    	this.updateFeatureGeometry = this.updateFeatureGeometry.bind(this);
    	this.getGeometryForFeature = this.getGeometryForFeature.bind(this);
    	this.generateFeatureFromGeoJson = this.generateFeatureFromGeoJson.bind(this);
    }
    addListener(listener) {

    	var listeners = this.state.listeners.slice();
    	this.state.listeners.forEach(listener => listener.remove());
    	listeners.push(listener);
    	this.setState({listeners});

    }
    componentWillReceiveProps(nextProps) {
		if(nextProps.data && this.state.feature) {
	   		this.checkPropEditable(nextProps);
    	}
    	console.log("Feature will recieve props.");
    }
    componentWillUpdate(nextProps, nextState) {
     	    
    }
    // shouldComponentUpdate(nextProps, nextState) {
    // 	return true;
    // }
    updateFeatureGeometry(geoJson) {

    }
    getGeometryForFeature(geoJson) {
    	var {map,maps} = this.props;
    	switch(geoJson.geometry.type) {
    		case "Polygon":
		    	var latLngs = geoJson.geometry.coordinates[0].map(coordinate => new maps.LatLng({lng : coordinate[0], lat: coordinate[1]}));
		    	var properties = geoJson.properties;
		    	var polygon = new maps.Data.Polygon([latLngs]);
		    	return polygon;
		    // case "Point": //TODO: Add all the types.
		    default:
		    	console.warn("You cannot use anything other than Polygons for features currently.");
    	}
    	return null;    	
    }
    generateFeatureFromGeoJson(geoJson) {
    	var {map, maps} = this.props;
    	var geometry = this.getGeometryForFeature(geoJson);
    	var feature = new maps.Data.Feature({
    		geometry,
    		id : this.props.id,
    		properties : geoJson.properties
    	});
    	return feature;
    }
    componentDidMount() {
      if(this.props.data) {

      	var id = undefined;
      	console.log("Feature Mounted with ID:", this.props.id);
      	if(this.props.id) {
      		id = this.props.id
      	}//Force the user to supply the property to use as the id.
      	var feature;
      	try {
			feature = this.generateFeatureFromGeoJson(this.props.geoJson)
      	}
      	catch(e)
      	{
      		console.error(e);
      	}

      	this.setState({
      		feature
      	}, () => {
      		this.props.data.add(feature);


      		//Setup listeners for this features.
      		if(this.props.onChange)
      		
      		this.addListener(this.props.data.addListener('setgeometry', ({feature}) => {
      			console.log("setgeometry fired");
      			if(feature.getId() == this.state.feature.getId())
	      			feature.toGeoJson(geoJson => this.props.onChange(geoJson));
      		}));

      		this.checkPropEditable(this.props);
      	})
      }
      else
      	console.error(new Error("You must put this <Feature /> component within the context of a <DataLayer /> Component."))
    }
    componentWillUnmount() {
    	console.error("Feature unmounting.");
    	if(this.props.data)
    		this.props.data.remove(this.state.feature);

    	if(this.state.listeners)
    		this.state.listeners.forEach(listener => listener.remove());
    }
    getDataFeature() {
    	return this.state.feature;
    }
    checkPropEditable(props) {
    	console.log("Checking editable.");
    	try {
	    	if(typeof props.editable !== 'undefined' && props.editable) {
	    		props.data.overrideStyle(this.state.feature, {editable : true});
	    	}
	    	else
	    		props.data.overrideStyle(this.state.feature, {editable : false});

    	}
    	catch(e) {
    		console.error(e);
    	}
    }
    render() {
    	if(this.props.data && this.state.feature) {
	   		this.checkPropEditable();

    	}
    	console.log("Feature Rendered");
        return <div>Feature</div>;
    }
}

Feature.propTypes = {
	maps : React.PropTypes.object,
	map : React.PropTypes.object,
	data : React.PropTypes.object,
	geoJson : React.PropTypes.object.isRequired,
	id : React.PropTypes.string.isRequired,
}

export default Feature;

import React from 'react';
import { GeoJSON } from '../utils/utils';
window.GeoJSON = GeoJSON;

//Rational: This component emulates the google Data.Feature. 
//It lives in the context of a <DataLayer /> Component and interfaces with it's Data object that has been passed as prop to it.
/** The component that handles individual features within a data layer. */
class Feature extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Feature';

    this.state = {
      feature: null,
      listeners: [],
      geoJson: null
    }

    this.initListeners = this.initListeners.bind(this);
    this.addListener = this.addListener.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    //Check props.
    this.checkPropEditable = this.checkPropEditable.bind(this);

    this.updateFeatureGeometry = this.updateFeatureGeometry.bind(this);
    this.getGeometryForFeature = this.getGeometryForFeature.bind(this);
    this.generateFeatureFromGeoJson = this.generateFeatureFromGeoJson.bind(this);
  }
  ///--------------------------------Listener Management Methods-----------------------------------///
  initListeners() {
    //Set geometry listener.
    if (typeof this.props.onChange === 'function')
      this.addListener(this.props.data.addListener('setgeometry', (event) => {
        var { feature } = event;
        if (feature.getId() == this.state.feature.getId()) {
          feature.toGeoJson(geoJson => this.setState({ geoJson: JSON.parse(JSON.stringify(geoJson)) }, () => {
            if (typeof this.props.onChange === 'function')
              this.props.onChange(geoJson);
          }));
        }
      }));

    //Polygon clicked.
    if (typeof this.props.onClick === 'function')
      this.addListener(this.props.data.addListener('click', (event) => {
        var { feature } = event;
        if (feature.getId() == this.state.feature.getId()) {
          event.stop();
          var coords = event.latLng.toJSON()
          coords[0] = coords.lng;
          coords[1] = coords.lat;

          if (this.props.onClick)
            this.props.onClick(Object.assign({}, event, { id: this.props.id, coords, geoJson: this.state.geoJson }));
        }
      }));

    if (typeof this.props.onRightClick === 'function')
      this.addListener(this.props.data.addListener('rightclick', (event) => {
        var { feature } = event;
        if (feature.getId() == this.state.feature.getId()) {
          event.stop();
          var coords = event.latLng.toJSON()
          coords[0] = coords.lng;
          coords[1] = coords.lat;

          if (this.props.onRightClick)
            this.props.onRightClick(Object.assign({}, event, { id: this.props.id, coords, geoJson: this.state.geoJson }));
        }
      }));
  }
  removeListeners(callback) {
    this.state.listeners.forEach(listener => listener.remove());
    this.setState({ listeners: [] }, callback ? callback : () => { });
  }
  addListener(listener, callback) {
    var listeners = this.state.listeners.slice();
    listeners.push(listener);
    this.setState({ listeners }, callback ? callback : () => { });
  }
  ///--------------------------------Lifecycle Methods-----------------------------------///
  componentWillReceiveProps(nextProps) {
    // console.log("F: componentWillRecieveProps");
    if (nextProps.data && this.state.feature) {
      this.checkPropEditable(nextProps);
      this.updateFeatureGeometry(nextProps.geoJson)

    }
    // console.log("Feature will recieve props.");
  }
  componentWillUpdate(nextProps, nextState) {
    // console.log("F: componentWillUpdate")
  }
  // shouldComponentUpdate(nextProps, nextState) {
  // 	return false;
  // }
  componentDidMount() {
    // console.log("F: componentDidMount")
    if (this.props.data) {

      var id = undefined;
      // console.log("Feature Mounted with ID:", this.props.id);
      if (this.props.id) {
        id = this.props.id
      }//Force the user to supply the property to use as the id.
      var feature;
      try {
        feature = this.generateFeatureFromGeoJson(this.props.geoJson)
      }
      catch (e) {
        console.error(e);
      }

      this.setState({
        feature,
        geoJson: JSON.parse(JSON.stringify(this.props.geoJson)) //Deep copy
      }, () => {
        this.props.data.add(feature);


        this.initListeners();
        this.checkPropEditable(this.props);
      })
    }
    else
      console.error(new Error("You must put this <Feature /> component within the context of a <DataLayer /> Component."))
  }
  componentWillUnmount() {
    if (this.props.data)
      this.props.data.remove(this.state.feature);

    if (this.state.listeners)
      this.removeListeners();
  }

  ///--------------------------------Google Data.Feature Managmenent Methods-----------------------------------///
  updateFeatureGeometry(geoJson) {
    //resets the geometry to match the geojson.
    var resetGeometry = f => {
      // this.removeListeners(() => {
      var geometry = this.getGeometryForFeature(geoJson);
      this.state.feature.setGeometry(geometry);
      // console.log("F: refreshed geometry for id: ", this.props.id);
      // this.initListeners(); //Restart the listening on this geometry.
      // }); //Stop all listening on this geometry.
    }

    //Diff: this logic block makes sure that we have to reset the geometry.
    if (this.state.feature) {
      var type = this.state.feature.getGeometry().getType();
      switch (type) {
        case "Polygon":
          var currGeoJson = this.state.geoJson;
          //If the coordinates length is not the same, obviously something changed so reset the geometry.
          if (geoJson.geometry.coordinates[0].length != currGeoJson.geometry.coordinates[0].length) {
            // console.log("F: Entered unequal coordinate block for id: ", this.props.id);
            resetGeometry();
          }
          //If the coordinate lengths are the same, check to see if all of the points are equal. If any of them are not equal, obviously something changed so reset the geometry.
          else {
            // console.log("F: Starting coordinate comparison for id: ", this.props.id , currGeoJson.geometry.coordinates[0], geoJson.geometry.coordinates[0]);

            for (var i = currGeoJson.geometry.coordinates[0].length - 1; i >= 0; i--) {
              var currPoint = currGeoJson.geometry.coordinates[0][i];
              var newPoint = geoJson.geometry.coordinates[0][i];
              if (currPoint[0] != newPoint[0] || currPoint[1] != newPoint[1]) {
                // console.log("F: Entered modified point block for id: ", this.props.id);
                resetGeometry();
                break;
              }
            };
          }
          break;
        case "Point": 
          var currGeoJson = this.state.geoJson;
          if (currGeoJson.geometry.coordinates[0] != geoJson.geometry.coordinates[0] || 
          currGeoJson.geometry.coordinates[1] != geoJson.geometry.coordinates[1]) {              
            resetGeometry();
            break;
          }
        break;
      }
    }
  }
  getGeometryForFeature(geoJson) {
    var { map, maps } = this.props;
    switch (geoJson.geometry.type) {
      case "Polygon":
        var latLngs = geoJson.geometry.coordinates[0].map(coordinate => new maps.LatLng({ lng: coordinate[0], lat: coordinate[1] }));
        latLngs.pop(); //Remove the last item.
        var properties = geoJson.properties;
        var polygon = new maps.Data.Polygon([latLngs]);
        return polygon;
      case "Point":
        var latLng = new maps.LatLng({ lng: geoJson.geometry.coordinates[0], lat: geoJson.geometry.coordinates[1] })
        var properties = geoJson.properties;
        var point = new maps.Data.Point(latLng)
        return point;
      default:
        console.warn("You cannot use anything other than Polygons or Points for features currently.");
    }
    return null;
  }
  generateFeatureFromGeoJson(geoJson) {
    var { map, maps } = this.props;
    var geometry = this.getGeometryForFeature(geoJson);
    var feature = new maps.Data.Feature({
      geometry,
      id: this.props.id,
      properties: geoJson.properties
    });
    return feature;
  }
  checkPropEditable(props) {
    // console.log("Checking editable.");
    try {
      if (typeof props.editable !== 'undefined' && props.editable) {
        props.data.overrideStyle(this.state.feature, { editable: true });
      }
      else
        props.data.overrideStyle(this.state.feature, { editable: false });

    }
    catch (e) {
      console.error(e);
    }
  }

  render() {
    if (this.props.data && this.state.feature) {
      this.checkPropEditable(this.props);

    }
    // console.log("F: feature Rendered");
    return <noscript />;
  }
}

Feature.propTypes = {
  maps: React.PropTypes.object,
  map: React.PropTypes.object,
  data: React.PropTypes.object,
  geoJson: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  onClick: React.PropTypes.func
}

export default Feature;

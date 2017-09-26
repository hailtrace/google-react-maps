import React from 'react';
import { GeoJSON } from '../utils/utils';
window.GeoJSON = GeoJSON;

let _mounted = false;

//Rational: This component emulates the google Data.Feature.
//It lives in the context of a <DataLayer /> Component and interfaces with it's Data object that has been passed as prop to it.
/** The component that handles individual features within a data layer. */
class Feature extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Feature';

    this.state = {
      selected_point: null,
      feature: null,
      geoJson: null
    }
    this.listeners = [];

    //Editor helper functions
    this.addPoint = this.addPoint.bind(this);
    this.findPoint = this.findPoint.bind(this);
    this.selectPoint = this.selectPoint.bind(this);
    this.deletePoint = this.deletePoint.bind(this);

    this.initListeners = this.initListeners.bind(this);
    this.addListener = this.addListener.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    //Check props.
    this.checkPropEditable = this.checkPropEditable.bind(this);
    this.setDraggable = this.setDraggable.bind(this);
    this.setIcon = this.setIcon.bind(this);

    this.updateFeatureGeometry = this.updateFeatureGeometry.bind(this);
    this.getGeometryForFeature = this.getGeometryForFeature.bind(this);
    this.generateFeatureFromGeoJson = this.generateFeatureFromGeoJson.bind(this);
    this.updateProperties = this.updateProperties.bind(this);

  }
  ///--------------------------------Editor Helper Methods-----------------------------------///
  addPoint(latLng) {
    const { feature } = this.state;
    const { editable, fastEditing } = this.props;
    const point = this.state.selected_point ? this.state.selected_point : null;
    if(!feature || !latLng || !point || !editable || !fastEditing) {
      return;
    }

    const type = feature.getGeometry().getType();
    switch(type) {
      case 'Polygon': {
        const pointArray = feature.getGeometry().getAt(0).getArray();
        const newGeometry = new this.props.maps.Data.Polygon([[
          ...pointArray.slice(0, point.index + 1),
          latLng,
          ...pointArray.slice(point.index + 1, pointArray.length)
        ]]);
        feature.setGeometry(newGeometry);
        if(_mounted) {
          this.setState({ selected_point: { index: point.index + 1, latLng } });
        }
        break;
      }
    }

  }
  findPoint(latLng) {
    const { feature } = this.state;

    if(!feature || !latLng) {
      return false;
    }

    switch (feature.getGeometry().getType()) {
      case 'Polygon': {
        const geometry = feature.getGeometry();
        const linearRing = geometry.getAt(0);
        const pointArray = linearRing.getArray();
        for(let i = 0; i < pointArray.length; i++) {
          let point = pointArray[i];
          if(point.lat() == latLng.lat() && point.lng() == latLng.lng()) {
            //Match found!
            return { index: i, latLng: point };
            break;
          }
        }
        break;
      }
    }

    return false;
  }
  selectPoint(latLng) {
    const foundPoint = this.findPoint(latLng);
    if(foundPoint && _mounted) {
      this.setState({ selected_point: foundPoint });
    }
  }
  deletePoint(latLng) {
    const { feature } = this.state;
    const { editable, fastEditing } = this.props;
    const point = this.state.selected_point;

    if(!feature || !latLng || !point || !editable || !fastEditing) {
      return;
    }

    const type = feature.getGeometry().getType();
    switch(type) {
      case 'Polygon': {
        const pointArray = feature.getGeometry().getAt(0).getArray();

        if(pointArray.length - 1 < 3) {
          if(this.props.onDelete) {
            this.props.onDelete(this.state.geoJson);
          }
          return;
        }

        const newGeometry = new this.props.maps.Data.Polygon([[
          ...pointArray.slice(0, point.index),
          ...pointArray.slice(point.index + 1, pointArray.length)
        ]]);

        feature.setGeometry(newGeometry);

        if(point.index - 1 > -1) {
          this.selectPoint(pointArray[point.index - 1]);
        }
        else {
          this.selectPoint(pointArray[0])
        }
        break;
      }
    }

  }
  ///--------------------------------Listener Management Methods-----------------------------------///
  initListeners() {
    //Set geometry listener.
    if (typeof this.props.onChange === 'function')
      this.addListener(this.props.data.addListener('setgeometry', (event) => {
        var { feature } = event;
        if (feature.getId() == this.state.feature.getId()) {
          feature.toGeoJson(geoJson => {
            if(_mounted) {
              this.setState({ geoJson: JSON.parse(JSON.stringify(geoJson)) }, () => {
                if (typeof this.props.onChange === 'function')
                  this.props.onChange(geoJson);
              })
            }
          });
        }
      }));

    //Polygon clicked.
    if(
      this.state.feature &&
      this.props.infoWindow
    ) {
      this.addListener(this.props.data.addListener('click', e => {
        const { feature } = e;
        if(feature.getId() == this.state.feature.getId()) {
          const infoWindow = new this.props.maps.InfoWindow({
            content: this.props.infoWindow,
            position: e.latLng.toJSON()
          });
          infoWindow.open(this.props.map);
        }
      }));
    }
    else if (typeof this.props.onClick === 'function')
      this.addListener(this.props.data.addListener('click', (event) => {
        var { feature } = event;
        if (feature.getId() == this.state.feature.getId()) {
          //Select the point. (Used in fastEditing mode.)
          this.selectPoint(event.latLng);

          // event.stop();
          var coords = event.latLng.toJSON()
          coords[0] = coords.lng;
          coords[1] = coords.lat;

          if (this.props.onClick)
            this.props.onClick(Object.assign({}, event, { id: this.props.id, coords, geoJson: this.state.geoJson }));
        }
      }));

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

    this.addListener(this.props.maps.event.addListener(this.props.map, 'click', ({latLng}) => this.addPoint(latLng)));
    this.addListener(this.props.maps.event.addListener(this.props.map, 'rightclick', () => this.deletePoint(this.state.selected_point)));
    this.addListener(this.props.data.addListener('click', event => {
      const { latLng } = event;
      this.addPoint(latLng);
    }))
  }
  removeListeners(callback) {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }
  addListener(listener, callback) {
    var listeners = this.listeners.slice();
    listeners.push(listener);
    this.listeners = listeners;
  }
  ///--------------------------------Lifecycle Methods-----------------------------------///
  componentWillReceiveProps(nextProps) {
    // console.log("F: componentWillRecieveProps");
    if (nextProps.data && this.state.feature) {
      this.checkPropEditable(nextProps);
      this.updateProperties(nextProps.geoJson.properties);
      this.updateFeatureGeometry(nextProps.geoJson)
    }
    // console.log("Feature will recieve props.");
  }
  componentWillUpdate(nextProps, nextState) {
    this.removeListeners();
  }
  componentDidUpdate(prev_props) {
    this.initListeners();
    if(prev_props.draggable != this.props.draggable) {
      this.setDraggable();
    }
    if(prev_props.icon != this.props.icon) {
      this.setIcon();
    }
  }
  componentDidMount() {
    // console.log("F: componentDidMount")
    _mounted = true;
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
        this.setDraggable();
        this.setIcon();
      })
    }
    else
      console.error(new Error("You must put this <Feature /> component within the context of a <DataLayer /> Component."))
  }
  componentWillUnmount() {
    _mounted = false;
    if (this.props.data)
      this.props.data.remove(this.state.feature);

    if (this.state.listeners)
      this.removeListeners();
  }

  ///--------------------------------Google Data.Feature Managmenent Methods-----------------------------------///
  updateProperties(properties) {
    const names = Object.keys(properties);
    names.forEach(name => this.state.feature.setProperty(name, properties[name]));
  }
  updateFeatureGeometry(geoJson) {
    //resets the geometry to match the geojson.
    var resetGeometry = f => {
      // this.removeListeners(() => {
      this.removeListeners();
      var geometry = this.getGeometryForFeature(geoJson);
      this.state.feature.setGeometry(geometry);
      this.initListeners();
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
  setDraggable() {
    if(this.props.draggable) {
      this.props.data.overrideStyle(this.state.feature, { draggable: true });
    }
    else {
      this.props.data.overrideStyle(this.state.feature, { draggable: false });
    }
  }
  setIcon() {
    if(this.props.geoJson.geometry.type == 'Point') {
      if(this.props.icon) {
        this.props.data.overrideStyle(this.state.feature, { icon: this.props.icon });
      }
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
  editable: React.PropTypes.bool,
  fastEditing: React.PropTypes.bool, //This mode enables point creation by right clicking on the map.
  maps: React.PropTypes.object,
  map: React.PropTypes.object,
  data: React.PropTypes.object,
  geoJson: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  onDelete: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onClick: React.PropTypes.func
}

export default Feature;

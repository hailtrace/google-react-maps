'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.GeoJSON = _utils.GeoJSON;

//Rational: This component emulates the google Data.Feature. 
//It lives in the context of a <DataLayer /> Component and interfaces with it's Data object that has been passed as prop to it.
/** The component that handles individual features within a data layer. */

var Feature = function (_React$Component) {
  _inherits(Feature, _React$Component);

  function Feature(props) {
    _classCallCheck(this, Feature);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Feature).call(this, props));

    _this.displayName = 'Feature';

    _this.state = {
      feature: null,
      listeners: [],
      geoJson: null
    };

    _this.initListeners = _this.initListeners.bind(_this);
    _this.addListener = _this.addListener.bind(_this);
    _this.removeListeners = _this.removeListeners.bind(_this);
    //Check props.
    _this.checkPropEditable = _this.checkPropEditable.bind(_this);

    _this.updateFeatureGeometry = _this.updateFeatureGeometry.bind(_this);
    _this.getGeometryForFeature = _this.getGeometryForFeature.bind(_this);
    _this.generateFeatureFromGeoJson = _this.generateFeatureFromGeoJson.bind(_this);
    return _this;
  }
  ///--------------------------------Listener Management Methods-----------------------------------///


  _createClass(Feature, [{
    key: 'initListeners',
    value: function initListeners() {
      var _this2 = this;

      //Set geometry listener.
      if (typeof this.props.onChange === 'function') this.addListener(this.props.data.addListener('setgeometry', function (event) {
        var feature = event.feature;

        if (feature.getId() == _this2.state.feature.getId()) {
          feature.toGeoJson(function (geoJson) {
            return _this2.setState({ geoJson: JSON.parse(JSON.stringify(geoJson)) }, function () {
              if (typeof _this2.props.onChange === 'function') _this2.props.onChange(geoJson);
            });
          });
        }
      }));

      //Polygon clicked.
      if (typeof this.props.onClick === 'function') this.addListener(this.props.data.addListener('click', function (event) {
        var feature = event.feature;

        if (feature.getId() == _this2.state.feature.getId()) {
          event.stop();
          var coords = event.latLng.toJSON();
          coords[0] = coords.lng;
          coords[1] = coords.lat;

          if (_this2.props.onClick) _this2.props.onClick({ id: _this2.props.id, coords: coords, geoJson: _this2.state.geoJson });
        }
      }));

      if (typeof this.props.onRightClick === 'function') this.addListener(this.props.data.addListener('rightclick', function (event) {
        var feature = event.feature;

        if (feature.getId() == _this2.state.feature.getId()) {
          event.stop();
          var coords = event.latLng.toJSON();
          coords[0] = coords.lng;
          coords[1] = coords.lat;

          if (_this2.props.onRightClick) _this2.props.onRightClick(Object.assign({}, event, { id: _this2.props.id, coords: coords, geoJson: _this2.state.geoJson }));
        }
      }));
    }
  }, {
    key: 'removeListeners',
    value: function removeListeners(callback) {
      this.state.listeners.forEach(function (listener) {
        return listener.remove();
      });
      this.setState({ listeners: [] }, callback ? callback : function () {});
    }
  }, {
    key: 'addListener',
    value: function addListener(listener, callback) {
      var listeners = this.state.listeners.slice();
      listeners.push(listener);
      this.setState({ listeners: listeners }, callback ? callback : function () {});
    }
    ///--------------------------------Lifecycle Methods-----------------------------------///

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // console.log("F: componentWillRecieveProps");
      if (nextProps.data && this.state.feature) {
        this.checkPropEditable(nextProps);
        this.updateFeatureGeometry(nextProps.geoJson);
      }
      // console.log("Feature will recieve props.");
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {}
    // console.log("F: componentWillUpdate")

    // shouldComponentUpdate(nextProps, nextState) {
    // 	return false;
    // }

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      // console.log("F: componentDidMount")
      if (this.props.data) {

        var id = undefined;
        // console.log("Feature Mounted with ID:", this.props.id);
        if (this.props.id) {
          id = this.props.id;
        } //Force the user to supply the property to use as the id.
        var feature;
        try {
          feature = this.generateFeatureFromGeoJson(this.props.geoJson);
        } catch (e) {
          console.error(e);
        }

        this.setState({
          feature: feature,
          geoJson: JSON.parse(JSON.stringify(this.props.geoJson)) //Deep copy
        }, function () {
          _this3.props.data.add(feature);

          _this3.initListeners();
          _this3.checkPropEditable(_this3.props);
        });
      } else console.error(new Error("You must put this <Feature /> component within the context of a <DataLayer /> Component."));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      console.error("Feature unmounting.");
      if (this.props.data) this.props.data.remove(this.state.feature);

      if (this.state.listeners) this.removeListeners();
    }

    ///--------------------------------Google Data.Feature Managmenent Methods-----------------------------------///

  }, {
    key: 'updateFeatureGeometry',
    value: function updateFeatureGeometry(geoJson) {
      var _this4 = this;

      //resets the geometry to match the geojson.
      var resetGeometry = function resetGeometry(f) {
        // this.removeListeners(() => {
        var geometry = _this4.getGeometryForFeature(geoJson);
        _this4.state.feature.setGeometry(geometry);
        // console.log("F: refreshed geometry for id: ", this.props.id);
        // this.initListeners(); //Restart the listening on this geometry.
        // }); //Stop all listening on this geometry.
      };

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
          // case "Point": 

        }
      }
    }
  }, {
    key: 'getGeometryForFeature',
    value: function getGeometryForFeature(geoJson) {
      var _props = this.props;
      var map = _props.map;
      var maps = _props.maps;

      switch (geoJson.geometry.type) {
        case "Polygon":
          var latLngs = geoJson.geometry.coordinates[0].map(function (coordinate) {
            return new maps.LatLng({ lng: coordinate[0], lat: coordinate[1] });
          });
          latLngs.pop(); //Remove the last item.
          var properties = geoJson.properties;
          var polygon = new maps.Data.Polygon([latLngs]);
          return polygon;
        // case "Point": //TODO: Add all the types.
        default:
          console.warn("You cannot use anything other than Polygons for features currently.");
      }
      return null;
    }
  }, {
    key: 'generateFeatureFromGeoJson',
    value: function generateFeatureFromGeoJson(geoJson) {
      var _props2 = this.props;
      var map = _props2.map;
      var maps = _props2.maps;

      var geometry = this.getGeometryForFeature(geoJson);
      var feature = new maps.Data.Feature({
        geometry: geometry,
        id: this.props.id,
        properties: geoJson.properties
      });
      return feature;
    }
  }, {
    key: 'checkPropEditable',
    value: function checkPropEditable(props) {
      // console.log("Checking editable.");
      try {
        if (typeof props.editable !== 'undefined' && props.editable) {
          props.data.overrideStyle(this.state.feature, { editable: true });
        } else props.data.overrideStyle(this.state.feature, { editable: false });
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.data && this.state.feature) {
        this.checkPropEditable(this.props);
      }
      // console.log("F: feature Rendered");
      return _react2.default.createElement('noscript', null);
    }
  }]);

  return Feature;
}(_react2.default.Component);

Feature.propTypes = {
  maps: _react2.default.PropTypes.object,
  map: _react2.default.PropTypes.object,
  data: _react2.default.PropTypes.object,
  geoJson: _react2.default.PropTypes.object.isRequired,
  id: _react2.default.PropTypes.string.isRequired,
  onChange: _react2.default.PropTypes.func,
  onClick: _react2.default.PropTypes.func
};

exports.default = Feature;
module.exports = exports['default'];
//# sourceMappingURL=feature.js.map
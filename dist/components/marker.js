'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* The component designed to implement the google.maps.Marker from the javascript api. <Marker /> components live within the context of any <Map /> component.
* @memberof Map
* @property {object} state
* @property {google.maps.Marker} state.Marker
* @property {object} props
* @property {google.maps.Map} props.map
* @property {google.maps} props.maps
* @property {object} props.coords Defines the coordinate pair where this marker should exits.
* @property {number} props.coords.lng Number defining longitude.
* @property {number} props.coords.lat Number defining latitude.
* @property {string|Icon} props.icon
* @property {google.maps.MarkerOptions} props.options See [Marker Options Documentation]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions}
*/
var Marker = function (_React$Component) {
  _inherits(Marker, _React$Component);

  function Marker(props) {
    _classCallCheck(this, Marker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Marker).call(this, props));

    _this.displayName = 'Marker';
    _this.state = {
      marker: null
    };

    _this.getOptions = _this.getOptions.bind(_this);
    return _this;
  }

  _createClass(Marker, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      if (this.props.map && this.props.maps) {
        var _props = this.props;
        var map = _props.map;
        var maps = _props.maps;
        var MarkerClusterer = _props.MarkerClusterer;


        var marker = new maps.Marker(this.getOptions());

        marker.setMap(this.props.map);

        this.setState({ marker: marker });

        if (MarkerClusterer) MarkerClusterer.addMarker(marker);

        if (typeof this.props.onClick === 'function') this.props.maps.event.addListener(marker, 'click', function (e) {
          if (_this2.props.onClick) _this2.props.onClick({ coords: marker.getPosition().toJSON() });
        });
        if (typeof this.props.onDragEnd === 'function') this.props.maps.event.addListener(marker, 'dragend', function (e) {
          _this2.props.onDragEnd(e.latLng.toJSON(), e);
        });
      } else {
        // Whoah boy! We need a map bigly.
        console.error(new Error("<Marker /> components must be instantiated within a Map component. Please check your component's context."));
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {}
  }, {
    key: 'getOptions',
    value: function getOptions() {
      var options = {
        position: this.props.coords,
        // map : this.props.map,
        icon: this.props.icon ? this.props.icon : undefined
      };
      if (this.props.options) options = Object.assign(options, this.props.options);
      return options;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.state.marker) {
        this.state.marker.setMap(null);
      }
      this.setState({ marker: null });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.marker) {
        this.state.marker.setOptions(this.getOptions());

        if (this.props.MarkerClusterer) this.props.MarkerClusterer.addMarker(this.state.marker);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var children = [];
      if (this.props.children) children = _react2.default.Children.map(this.props.children, function (child) {
        return _react2.default.cloneElement(child, {
          map: _this3.props.map,
          maps: _this3.props.maps,
          anchor: _this3.state.marker
        });
      });
      return _react2.default.createElement(
        'div',
        null,
        children
      );
    }
  }]);

  return Marker;
}(_react2.default.Component);

Marker.propTypes = {
  maps: _react2.default.PropTypes.object,
  map: _react2.default.PropTypes.object,
  MarkerClusterer: _react2.default.PropTypes.object,
  options: _react2.default.PropTypes.object,
  anchor: _react2.default.PropTypes.object,
  coords: _react2.default.PropTypes.shape({
    lng: _react2.default.PropTypes.number,
    lat: _react2.default.PropTypes.number
  })
};

exports.default = Marker;
module.exports = exports['default'];
//# sourceMappingURL=marker.js.map
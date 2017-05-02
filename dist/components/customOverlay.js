'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function GMCustomOverlay(elem, map) {
  this.div_ = elem;
  this.map_ = map;
  this.coords_ = null;
  try {
    this.setMap(map);
  } catch (ex) {
    console.error(ex);
  }
}

var CustomOverlay = function (_React$Component) {
  _inherits(CustomOverlay, _React$Component);

  function CustomOverlay(props) {
    _classCallCheck(this, CustomOverlay);

    var _this = _possibleConstructorReturn(this, (CustomOverlay.__proto__ || Object.getPrototypeOf(CustomOverlay)).call(this, props));

    _this.displayName = 'CustomOverlay';
    var maps = _this.props.maps;

    GMCustomOverlay.prototype = new props.maps.OverlayView();
    GMCustomOverlay.prototype.setCoords = function (coords) {
      this.coords_ = coords;
    };
    GMCustomOverlay.prototype.onRemove = function () {
      console.log("Remove");
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    };

    GMCustomOverlay.prototype.onAdd = function () {
      var div = this.div_;
      div.style.position = "absolute";
      this.div_ = div;
      var panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div_);
    };

    GMCustomOverlay.prototype.draw = function () {
      var overlayProjection = this.getProjection();
      var coords = new maps.LatLng(this.coords_);
      var coordsPixels = overlayProjection.fromLatLngToDivPixel(coords);
      var div = this.div_;

      div.style.left = coordsPixels.x - div.offsetWidth / 2 + 'px';
      div.style.top = coordsPixels.y - div.offsetHeight + 'px';

      // debugger;
    };

    return _this;
  }

  _createClass(CustomOverlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          maps = _props.maps,
          map = _props.map;

      try {
        this.overlay = new GMCustomOverlay(_reactDom2.default.findDOMNode(this.refs['custom-overlay']), this.props.map);
        this.overlay.setCoords(this.props.coords);

        if (typeof this.props.onClick === 'function') maps.event.addListener(map, 'click', function (event) {
          return _this2.props.onClick(event);
        });
      } catch (ex) {
        console.error(ex);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: this.props.className, style: this.props.style, ref: 'custom-overlay' },
        this.props.children
      );
    }
  }]);

  return CustomOverlay;
}(_react2.default.Component);

CustomOverlay.propTypes = {
  bounds: _react2.default.PropTypes.object,
  maps: _react2.default.PropTypes.object,
  map: _react2.default.PropTypes.object,
  coords: _react2.default.PropTypes.shape({
    lat: _react2.default.PropTypes.number.isRequired,
    lng: _react2.default.PropTypes.number.isRequired
  })
};

exports.default = CustomOverlay;
module.exports = exports['default'];
//# sourceMappingURL=customOverlay.js.map
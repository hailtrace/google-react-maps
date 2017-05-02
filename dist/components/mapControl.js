'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* The component that defines a custom map control at a predifined position.
* 
* @property {object} props
* @property {google.maps.Map} props.map
* @property {google.maps} props.maps
* @property {string} props.position
* @property {number} props.index
*/
var MapControl = function (_React$Component) {
  _inherits(MapControl, _React$Component);

  function MapControl(props) {
    _classCallCheck(this, MapControl);

    var _this = _possibleConstructorReturn(this, (MapControl.__proto__ || Object.getPrototypeOf(MapControl)).call(this, props));

    _this.displayName = 'MapControl';
    _this.cleanMapControlContent = _this.cleanMapControlContent.bind(_this);
    return _this;
  }

  _createClass(MapControl, [{
    key: 'cleanMapControlContent',
    value: function cleanMapControlContent() {
      var parent = _reactDom2.default.findDOMNode(this.refs.controlParent);
      var child = _reactDom2.default.findDOMNode(this.refs.controlChildren);
      parent.appendChild(child);
    }
  }, {
    key: 'loadMapControlContent',
    value: function loadMapControlContent() {
      var _props = this.props,
          maps = _props.maps,
          map = _props.map,
          position = _props.position;

      var children = _reactDom2.default.findDOMNode(this.refs.controlChildren);
      children.index = typeof this.props.index !== 'undefined' ? this.props.index : 1;

      if (position && map) {
        map.controls[maps.ControlPosition[position]].push(children);
      } else console.warn("You must provide your map control a specific control position.");
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadMapControlContent();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      console.log("Component unmounting.");
      this.cleanMapControlContent();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { ref: 'controlParent' },
        _react2.default.createElement(
          'div',
          { ref: 'controlChildren' },
          this.props.children
        )
      );
    }
  }]);

  return MapControl;
}(_react2.default.Component);

MapControl.propTypes = {
  map: _react2.default.PropTypes.object,
  maps: _react2.default.PropTypes.object,
  position: _react2.default.PropTypes.oneOf(Object.getOwnPropertyNames(_utils.ControlPosition)).isRequired,
  index: _react2.default.PropTypes.number
};

exports.default = MapControl;
module.exports = exports['default'];
//# sourceMappingURL=mapControl.js.map
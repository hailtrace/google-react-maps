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

/** Defines a circle shape in the map. Relates to google.maps.Circle class. 
* @property {object} props
* @property {number} props.radius
* @property {object} props.center
* @property {number} props.center.lat
* @property {number} props.center.lng
* @property {function} props.onRadiusChange
* @property {function} props.onCenterChange

*/
var Circle = function (_React$Component) {
    _inherits(Circle, _React$Component);

    function Circle(props) {
        _classCallCheck(this, Circle);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, props));

        _this.displayName = 'Circle';
        _this.setupListeners = _this.setupListeners.bind(_this);
        _this.state = { circle: null };

        _this.focus = _this.focus.bind(_this);
        return _this;
    }
    /** Focus the map on this circle. */


    _createClass(Circle, [{
        key: 'focus',
        value: function focus() {
            var circle = this.state.circle;
            var map = this.state.map;

            if (circle && map) {
                map.fitBounds(circle.getBounds());
            }
        }
        /** Setup the listeners for this circle */

    }, {
        key: 'setupListeners',
        value: function setupListeners() {
            var _this2 = this;

            var circle = this.state.circle;
            var _state = this.state;
            var maps = _state.maps;
            var map = _state.map;

            if (maps && circle) {
                maps.event.addListener(circle, 'radius_changed', function (e) {
                    if (typeof _this2.onRadiusChange === 'function') _this2.onRadiusChange({ radius: circle.getRadius() });
                });
                maps.event.addListener(circle, 'dragend', function (e) {
                    if (typeof _this2.onCenterChange === 'function') _this2.onCenterChange({ coords: circle.getCenter().toJSON() });
                });
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props = this.props;
            var map = _props.map;
            var maps = _props.maps;
            var center = _props.center;
            var clickable = _props.clickable;


            if (map && maps) {
                var CircleOptions = Object.assign({}, this.props, { maps: undefined });
                var circle = new maps.Circle(CircleOptions);
                this.setState({ circle: circle }, this.setupListeners);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.state.circle) {
                this.props.maps.clearListeners(this.state.circle);
                this.state.circle.setMap(null);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                'Circle'
            );
        }
    }]);

    return Circle;
}(_react2.default.Component);

var _React$PropTypes = _react2.default.PropTypes;
var number = _React$PropTypes.number;
var shape = _React$PropTypes.shape;


Circle.propTypes = {
    radius: number.isRequired,
    center: shape({
        lat: number,
        lng: number
    }).isRequired
};
exports.default = Circle;
module.exports = exports['default'];
//# sourceMappingURL=circle.js.map
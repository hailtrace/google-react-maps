'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _googleMapsApi = require('google-maps-api');

var _googleMapsApi2 = _interopRequireDefault(_googleMapsApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Map = function (_React$Component) {
    _inherits(Map, _React$Component);

    function Map(props) {
        _classCallCheck(this, Map);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Map).call(this, props));

        _this.displayName = 'Map';

        var _div_id = "map_div_" + Math.floor(Date.now() * Math.random()).toString();
        _this.state = {
            maps: null,
            children: [],
            _div_id: _div_id
        };
        return _this;
    }

    _createClass(Map, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var initMapComponentWithLibrary = function initMapComponentWithLibrary(maps) {
                window.maps = maps;

                _this2.setState({ maps: maps }, function () {
                    var mapOptions = {
                        zoom: 4,
                        mapTypeId: maps.MapTypeId.ROADMAP,
                        center: new maps.LatLng(39.5, -98.35),
                        data: null
                    };

                    if (_this2.props.mapOptions) mapOptions = _this2.props.mapOptions;

                    var map = new maps.Map(document.getElementById(_this2.state._div_id), mapOptions);

                    _this2.setState({
                        map: map
                    });
                });
            };

            if (this.props["api-key"]) {
                if (!window.maps) (0, _googleMapsApi2.default)(this.props["api-key"], ['drawing', 'geometry', 'places'])().then(initMapComponentWithLibrary);else initMapComponentWithLibrary(window.maps);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var children;
            if (this.state.maps && this.state.map) children = _react2.default.Children.map(this.props.children, function (child) {
                return _react2.default.cloneElement(child, {
                    maps: _this3.state.maps,
                    map: _this3.state.map
                });
            });

            return _react2.default.createElement(
                'div',
                { id: this.state._div_id, style: this.props.style },
                children
            );
        }
    }]);

    return Map;
}(_react2.default.Component);

Map.propTypes = {
    "api-key": _react2.default.PropTypes.string.isRequired,
    style: _react2.default.PropTypes.object
};

exports.default = Map;
module.exports = exports['default'];
//# sourceMappingURL=map.js.map
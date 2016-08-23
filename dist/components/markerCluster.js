'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _markerClustererPlus = require('marker-clusterer-plus');

var _markerClustererPlus2 = _interopRequireDefault(_markerClustererPlus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* Clusters `<Marker />` components passed as children in props.children

* @memberof Map
*
* @property {object} props
* @property {object} props.map The google.maps.Map object from the map component.
* @property {Array.<Map.Marker>} props.children These should only be {@link Marker} components.
* @property {MarkerClustererOptions} props.options The MarkerClusterer instantiates with these options.
* @property {object} state The state of the MarkerCluster component.
* @property {MarkerClusterer} state.MarkerClusterer The instance of {@link MarkerClusterer} for this component.
*
*
*/
var MarkerCluster = function (_React$Component) {
    _inherits(MarkerCluster, _React$Component);

    function MarkerCluster(props) {
        _classCallCheck(this, MarkerCluster);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MarkerCluster).call(this, props));

        _this.displayName = 'MarkerCluster';
        _this.state = {
            MarkerClusterer: null
        };
        return _this;
    }

    _createClass(MarkerCluster, [{
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {}
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            if (this.props.map && this.props.maps) {
                var options = { gridSize: 50, maxZoom: 15 };

                if (this.props.options) options = Object.assign(options, this.props.options);

                this.setState({
                    MarkerClusterer: new _markerClustererPlus2.default(this.props.map, [], options)
                });
            } else {
                console.error(new Error("You must run <MarkerCluster /> components within the context of a <Map /> component. Otherwise, provide the maps and map props manually."));
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var MarkerClusterer = this.state.MarkerClusterer;

            if (MarkerClusterer) {
                MarkerClusterer.clearMarkers();
            }
            this.setState({ MarkerClusterer: null });
        }
        // componentDidUpdate() {
        // if(this.state.MarkerClusterer)
        // 	this.state.MarkerClusterer.repaint();
        // }

    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var children = [];
            var _props = this.props;
            var map = _props.map;
            var maps = _props.maps;

            if (this.props.map && this.props.maps && this.state.MarkerClusterer) children = _react2.default.Children.map(this.props.children, function (child) {
                return _react2.default.cloneElement(child, {
                    MarkerClusterer: _this2.state.MarkerClusterer,
                    map: map,
                    maps: maps
                });
            });
            return _react2.default.createElement(
                'div',
                null,
                children
            );
        }
    }]);

    return MarkerCluster;
}(_react2.default.Component);

MarkerCluster.propTypes = {
    map: _react2.default.PropTypes.object,
    maps: _react2.default.PropTypes.object,
    options: _react2.default.PropTypes.object
};

exports.default = MarkerCluster;
module.exports = exports['default'];
//# sourceMappingURL=markerCluster.js.map
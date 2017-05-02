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

var KmlLayer = function (_React$Component) {
    _inherits(KmlLayer, _React$Component);

    function KmlLayer(props) {
        _classCallCheck(this, KmlLayer);

        var _this = _possibleConstructorReturn(this, (KmlLayer.__proto__ || Object.getPrototypeOf(KmlLayer)).call(this, props));

        _this.displayName = 'KmlLayer';
        _this.state = {
            KmlLayer: null
        };
        return _this;
    }

    _createClass(KmlLayer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.map && this.props.maps) {
                var _props = this.props,
                    map = _props.map,
                    maps = _props.maps,
                    zIndex = _props.zIndex,
                    preserveViewport = _props.preserveViewport,
                    screenOverlays = _props.screenOverlays,
                    suppressInfoWindows = _props.suppressInfoWindows,
                    url = _props.url;


                var KmlLayer = new maps.KmlLayer({
                    map: map,
                    zIndex: zIndex,
                    preserveViewport: preserveViewport,
                    screenOverlays: screenOverlays,
                    suppressInfoWindows: suppressInfoWindows,
                    url: url
                });

                this.setState({ KmlLayer: KmlLayer });
            } else console.error(new Error("You must put <KmlLayer /> components within a <Map /> context. Or provide the maps and map props manually."));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.state.KmlLayer) this.state.KmlLayer.setMap(null);
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.KmlLayer && this.props.url != this.state.KmlLayer.url) this.state.KmlLayer.setUrl(this.props.url);
            return _react2.default.createElement(
                'div',
                null,
                'KmlLayer'
            );
        }
    }]);

    return KmlLayer;
}(_react2.default.Component);

KmlLayer.propTypes = {
    maps: _react2.default.PropTypes.object,
    map: _react2.default.PropTypes.object,
    zIndex: _react2.default.PropTypes.number.isRequired,
    preserveViewport: _react2.default.PropTypes.bool,
    screenOverlays: _react2.default.PropTypes.bool,
    suppressInfoWindows: _react2.default.PropTypes.bool,
    url: _react2.default.PropTypes.string.isRequired
};

exports.default = KmlLayer;
module.exports = exports['default'];
//# sourceMappingURL=kmlLayer.js.map
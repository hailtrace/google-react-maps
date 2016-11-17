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

var DataLayer = function (_React$Component) {
    _inherits(DataLayer, _React$Component);

    function DataLayer(props) {
        _classCallCheck(this, DataLayer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataLayer).call(this, props));

        _this.displayName = 'DataLayer';
        _this.state = {
            data: null
        };

        _this.initDataLayer = _this.initDataLayer.bind(_this);

        //Prop Checking
        _this.checkPropVisibility = _this.checkPropVisibility.bind(_this);

        //Style
        _this.styleFeatures = _this.styleFeatures.bind(_this);

        //Focus
        _this.focus = _this.focus.bind(_this);

        return _this;
    }
    /** Focus the map on this dataLayer's features. */


    _createClass(DataLayer, [{
        key: 'focus',
        value: function focus() {
            var _props = this.props;
            var maps = _props.maps;
            var map = _props.map;

            var bounds = new maps.LatLngBounds();
            if (this.state.data) {
                this.state.data.forEach(function (feature) {
                    (0, _utils.processPoints)(feature.getGeometry(), bounds.extend, bounds);
                });
                map.fitBounds(bounds);
            }
        }
    }, {
        key: 'initDataLayer',
        value: function initDataLayer() {
            var _props2 = this.props;
            var map = _props2.map;
            var maps = _props2.maps;


            var dataOptions = {
                map: map
            };

            if (this.props.dataOptions) dataOptions = Object.assign(dataOptions, this.props.dataOptions);

            dataOptions = Object.assign(dataOptions, {
                style: this.styleFeatures
            });

            var dataLayer = new maps.Data(dataOptions);

            //If there is geoJSON, initialize it.
            if (this.props.geoJson) {
                var options = { idPropertyName: '_id' };
                if (this.props.idPropertyName) options.idPropertyName = this.props.idPropertyName;

                dataLayer.addGeoJson(this.props.geoJson, options);
            }

            // dataLayer.addListener('click', (event) => {
            //   var {feature} = event;
            //   var coords = event.latLng.toJSON()
            //   coords[0] = coords.lng;
            //   coords[1] = coords.lat;

            //   if(this.props.onClick)
            //     this.props.onClick({id : feature.getId(), coords });

            // });

            this.setState({ data: dataLayer });
        }
    }, {
        key: 'checkPropVisibility',
        value: function checkPropVisibility(nextProps) {
            var visible = this.props.visible;


            if (!visible && nextProps.visible) {
                this.state.data.setMap(this.props.map);
            } else if (visible && !nextProps.visible) this.state.data.setMap(null);
        }
    }, {
        key: 'styleFeatures',
        value: function styleFeatures(feature) {
            //If they passed in a function to completely overide style features, then do so.

            if (this.props.styleFeatures) return this.props.styleFeatures(feature);

            var geo = feature.getGeometry();
            var type = null;
            if (geo) type = geo.getType();

            var visible = feature.getProperty('visible');
            var zIndex = feature.getProperty('zIndex');
            var strokeColor = feature.getProperty('strokeColor');
            var fillColor = feature.getProperty('fillColor');
            var fillOpacity = this.props.fillOpacity;

            //Do some logic on the options to make things a bit easier.
            if (!strokeColor) strokeColor = fillColor;

            zIndex = zIndex ? zIndex : 10;

            if (this.props.zIndex) zIndex = zIndex + 10000 * this.props.zIndex; //TODO: Find a better way to separate out layer zIndexes. Right now we are defautling to 10000K features in a GeoJson schema. It works, but there should be a better way.

            switch (type) {
                case 'Polygon':
                    var polyOptions = {
                        strokeWeight: 1,
                        strokeColor: strokeColor,
                        fillColor: fillColor,
                        fillOpacity: fillOpacity
                    }; //Potential Enhancement: Polyoptions could have different defaults. For now, we will leave this.

                    if (typeof visible !== 'undefined') polyOptions.visible = true;
                    if (typeof zIndex !== 'undefined') ;
                    polyOptions.zIndex = zIndex;
                    return polyOptions;
                default:
                    return {};
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            console.log("DL: componentWillMount", this.props);
            if (this.props.maps && this.props.map) {
                this.initDataLayer();
                this.checkPropVisibility(this.props);
            } else console.error(new Error("You must put this compenent in a <Map /> context component or provide the maps and map props manually."));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            console.log("DL: componentWillUnmount");
            this.state.data.setMap(null);
            this.setState({ data: null });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            console.log("DL: componentDidUpdate", prevProps, prevState);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            console.log("DL: componentWillReceiveProps", nextProps, this.props);
            if (typeof nextProps.visible !== 'undefined') {
                this.checkPropVisibility(nextProps);
            }
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            console.log("DL: shouldComponentUpdate", nextProps, nextState);
            return true;
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            console.log("DL: componentWillUpdate", nextProps, nextState);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var children = [];

            if (this.state.data) {

                children = _react2.default.Children.map(this.props.children, function (child) {
                    return _react2.default.cloneElement(child, {
                        maps: _this2.props.maps,
                        map: _this2.props.map,
                        data: _this2.state.data
                    });
                });
            }
            console.log("Rendered DataLayer");
            return _react2.default.createElement(
                'div',
                null,
                children
            );
        }
    }]);

    return DataLayer;
}(_react2.default.Component);

DataLayer.propTypes = {
    maps: _react2.default.PropTypes.object,
    map: _react2.default.PropTypes.object,
    dataOptions: _react2.default.PropTypes.object,
    geoJson: _react2.default.PropTypes.object,
    visible: _react2.default.PropTypes.bool,
    onChange: _react2.default.PropTypes.func,
    styleFeatures: _react2.default.PropTypes.func,
    zIndex: _react2.default.PropTypes.number.isRequired,
    fillOpacity: _react2.default.PropTypes.number
};

exports.default = DataLayer;
module.exports = exports['default'];
//# sourceMappingURL=dataLayer.js.map
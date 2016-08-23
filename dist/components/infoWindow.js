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

/** The component designed to implement the google.maps.InfoWindow class. This component can be the child of either the `<Map />` or `<Marker />` components, but if you decide to put it within the `<Map />` component you must set its coordinate property so that it has an anchor point.
* @memberof Map
* 
* @property {object} props
* @property {google.maps} props.maps Required.
* @property {google.maps.Map} props.map Required.
* @property {google.maps.MVCObject} props.anchor Required if coordinates aren't provided.
* @property {object} props.coords Required if anchor isn't provided.
* @property {number} props.coords.lng
* @property {number} props.coords.lat
* @property {bool} props.disableAutopan
* @property {number} props.maxWidth
* @property {object} props.pixelOffset
* @property {object} props.pixelOffset.width
* @property {object} props.pixelOffset.height
* @property {google.maps.InfoWindowOptions} props.options These will overwrite any of the convenience props above. See [google.maps.InfoWindowOptions]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindowOptions} documentation for all the options.
* @property {bool} props.open Allows you to open and close a window without fully unmounting it.
* @property {object} state
* @property {google.maps.InfoWindow} state.infoWindow The internal instance of the infoWindow.
* @property {function} props.onCloseClick Use this to listen for the close click event. When someone tries to close the infowindow. Implement closing.
*/

var InfoWindow = function (_React$Component) {
   _inherits(InfoWindow, _React$Component);

   function InfoWindow(props) {
      _classCallCheck(this, InfoWindow);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InfoWindow).call(this, props));

      _this.displayName = 'InfoWindow';
      _this.state = {
         infoWindow: null,
         anchor: null
      };

      _this.loadInfoWindowContent = _this.loadInfoWindowContent.bind(_this);
      _this.node = null;
      return _this;
   }

   _createClass(InfoWindow, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
         var _this2 = this;

         var _props = this.props;
         var maps = _props.maps;
         var map = _props.map;
         var anchor = _props.anchor;
         var coords = _props.coords;

         if (maps && map) {
            var options = {
               position: anchor ? undefined : coords
            };
            var infoWindow = new maps.InfoWindow(options);
            if (this.props.open) infoWindow.open(map, anchor);else infoWindow.close();
            //Don't let the infowindow do it's default thing when a user tries to close it.
            maps.event.addListener(infoWindow, 'closeclick', function (e) {
               infoWindow.open(map, anchor);
               if (typeof _this2.props.onCloseClick === 'function') _this2.props.onCloseClick(e);
            });

            this.setState({ infoWindow: infoWindow, anchor: anchor });
         } else {
            console.error("InfoWindow must live inside of a <Map /> component context.");
         }
      }
      /** Load rendered children into infoWindow.
      * @return {undefined} 
      */

   }, {
      key: 'loadInfoWindowContent',
      value: function loadInfoWindowContent() {
         if (this.state.infoWindow) {

            this.node = _reactDom2.default.findDOMNode(this.refs.infoWindowChildren);
            this.state.infoWindow.setContent(this.node); //Set infowindow content
         }
      }
      /** Place rendered children back into their normal location to await their destruction.
      * @return {undefined}
      */

   }, {
      key: 'cleanInfoWindowContentForUnmount',
      value: function cleanInfoWindowContentForUnmount() {
         //Undo our previous dom manipulation.
         var parent = _reactDom2.default.findDOMNode(this);
         var child = this.node;
         parent.appendChild(child);
      }
   }, {
      key: 'componentDidMount',
      value: function componentDidMount() {

         this.loadInfoWindowContent();
      }
   }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
         if (this.state.infoWindow) this.state.infoWindow.open(null);
         this.setState({ infoWindow: null });
         this.cleanInfoWindowContentForUnmount();
      }
   }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
         if (this.state.infoWindow) {
            if (this.props.open) this.state.infoWindow.open(this.props.map, this.state.anchor);else this.state.infoWindow.close();
         }
         this.loadInfoWindowContent();

         this.state.infoWindow.setPosition(this.props.coords);
      }
   }, {
      key: 'render',
      value: function render() {

         return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
               'div',
               { ref: 'infoWindowChildren' },
               this.props.children
            )
         );
      }
   }]);

   return InfoWindow;
}(_react2.default.Component);

InfoWindow.propTypes = {
   maps: _react2.default.PropTypes.object,
   map: _react2.default.PropTypes.object,
   coords: _react2.default.PropTypes.shape({
      lat: _react2.default.PropTypes.number.isRequired,
      lng: _react2.default.PropTypes.number.isRequired
   }),
   onCloseClick: _react2.default.PropTypes.func
};

exports.default = InfoWindow;
module.exports = exports['default'];
//# sourceMappingURL=infoWindow.js.map
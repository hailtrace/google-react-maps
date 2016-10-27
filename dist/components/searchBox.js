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

var SearchBox = function (_React$Component) {
  _inherits(SearchBox, _React$Component);

  function SearchBox(props) {
    _classCallCheck(this, SearchBox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchBox).call(this, props));

    _this.displayName = 'SearchBox';
    _this.state = {
      searchBox: null,
      internalPosition: -1
    };
    _this.postRender = _this.postRender.bind(_this);
    _this.preRender = _this.preRender.bind(_this);
    return _this;
  }

  _createClass(SearchBox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.postRender();
    }
  }, {
    key: 'postRender',
    value: function postRender() {
      var _this2 = this;

      var _props = this.props;
      var map = _props.map;
      var maps = _props.maps;
      var position = _props.position;

      if (map && maps) {
        var input = _reactDom2.default.findDOMNode(this.refs.input);
        var container = _reactDom2.default.findDOMNode(this.refs.child);
        var searchBox = new maps.places.SearchBox(input);

        map.addListener('bounds_changed', function () {
          searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener('places_changed', function () {
          if (typeof _this2.props.onPlacesChanged === 'function') _this2.props.onPlacesChanged(searchBox.getPlaces());
        });

        if (!position) position = "TOP_LEFT";

        if (this.state.internalPosition < 0) map.controls[maps.ControlPosition[position]].push(container);else map.controls[maps.ControlPosition[position]].insertAt(this.state.internalPosition, container);

        var internalPosition = map.controls[maps.ControlPosition[position]].length - 1;

        if (this.state.internalPosition != internalPosition) this.setState({
          internalPosition: internalPosition
        });
      } else console.warn(new Error("You must pass this component as a control to a Map component."));
    }
  }, {
    key: 'preRender',
    value: function preRender() {
      var _props2 = this.props;
      var map = _props2.map;
      var maps = _props2.maps;
      var position = _props2.position;
      var internalPosition = this.state.internalPosition;

      map.controls[maps.ControlPosition[position]].removeAt(internalPosition);

      var child = _reactDom2.default.findDOMNode(this.refs.child);
      var parent = _reactDom2.default.findDOMNode(this.refs.parent);
      parent.appendChild(child);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      if (this.state.internalPosition > -1) this.preRender();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return false;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.internalPosition > -1 && prevState.internalPosition != -1) this.postRender();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.preRender();
    }
  }, {
    key: 'render',
    value: function render() {
      var Wrapper = this.props.wrapper;
      if (Wrapper) return _react2.default.createElement(
        'div',
        { ref: 'parent' },
        _react2.default.createElement(
          'div',
          { ref: 'child' },
          _react2.default.createElement(
            Wrapper,
            null,
            _react2.default.createElement('input', { type: 'text', ref: 'input', placeholder: this.props.placeholder, style: this.props.style, className: this.props.className })
          )
        )
      );else return _react2.default.createElement(
        'div',
        { ref: 'parent' },
        _react2.default.createElement(
          'div',
          { ref: 'child' },
          _react2.default.createElement('input', { type: 'text', ref: 'input', placeholder: this.props.placeholder, style: this.props.style, className: this.props.className })
        )
      );
    }
  }]);

  return SearchBox;
}(_react2.default.Component);

SearchBox.PropTypes = {
  placeholder: _react2.default.PropTypes.string,
  position: _react2.default.PropTypes.string.isRequired,
  wrapper: _react2.default.PropTypes.func,
  onPlacesChanged: _react2.default.PropTypes.func.isRequired
};

exports.default = SearchBox;
module.exports = exports['default'];
//# sourceMappingURL=searchBox.js.map
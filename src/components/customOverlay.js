import React from 'react';
import ReactDom from 'react-dom';

function GMCustomOverlay(elem, map) {
    this.div_ = elem;
    this.map_ = map;
    this.coords_ = null;
    try {
      this.setMap(map);
    }
    catch(ex) {
      console.error(ex);
    }
}



class CustomOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'CustomOverlay';
        const {maps} = this.props;
        GMCustomOverlay.prototype = new props.maps.OverlayView();
        GMCustomOverlay.prototype.setCoords = function(coords) {
          this.coords_ = coords;
        }
        GMCustomOverlay.prototype.onRemove = function() {
          console.log("Remove")
          this.div_.parentNode.removeChild(this.div_);
          this.div_ = null;
        }

        GMCustomOverlay.prototype.onAdd = function() {
          let div = this.div_;
          div.style.position = "absolute";
          this.div_=div;
          const panes = this.getPanes();
          panes.overlayLayer.appendChild(this.div_);
        }

        GMCustomOverlay.prototype.draw = function() {
          const overlayProjection = this.getProjection();
          const coords = new maps.LatLng(this.coords_);
          const coordsPixels = overlayProjection.fromLatLngToDivPixel(coords)
          let div = this.div_;


          div.style.left = `${(coordsPixels.x - (div.offsetWidth)/2)}px`;
          div.style.top = `${coordsPixels.y - div.offsetHeight}px`;

          // debugger;
        }

    }
    componentDidMount() {
      const {maps, map} = this.props;
      try {
        this.overlay = new GMCustomOverlay(ReactDom.findDOMNode(this.refs['custom-overlay']), this.props.map);
        this.overlay.setCoords(this.props.coords);

        if(typeof this.props.onClick === 'function')
          maps.event.addListener(map, 'click', (event) => this.props.onClick(event));
      }
      catch (ex) {
        console.error(ex)
      }
    }

    render() {
        return <div className={this.props.className} style={this.props.style} ref="custom-overlay">{this.props.children}</div>;
    }
}

CustomOverlay.propTypes = {
  bounds : React.PropTypes.object,
  maps : React.PropTypes.object,
  map : React.PropTypes.object,
  coords : React.PropTypes.shape({
    lat : React.PropTypes.number.isRequired,
    lng : React.PropTypes.number.isRequired
  })
}

export default CustomOverlay;

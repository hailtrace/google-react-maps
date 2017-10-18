import React from 'react';
import PropTypes from 'prop-types';

class KmlLayer extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'KmlLayer';
        this.state = {
        	KmlLayer : null
        }
    }
    componentDidMount() {
    	if(this.props.map && this.props.maps)
    	{
    		var {
    			map,
    			maps,
    			zIndex,
    			preserveViewport,
    			screenOverlays,
    			suppressInfoWindows,
    			url
    		} = this.props;

    		var KmlLayer = new maps.KmlLayer({
    			map,
    			zIndex,
    			preserveViewport,
    			screenOverlays,
    			suppressInfoWindows,
    			url
    		});
    		this.setState({KmlLayer});
        this.listener = KmlLayer.addListener('status_changed', (status) => {
          switch(KmlLayer.getStatus()) {
            case 'INVALID_DOCUMENT' : {
              console.error('Your kml doc is too big for google maps.');
              if(this.props.onStatusChanged) {
                this.props.onStatusChanged(KmlLayer.getStatus());
              }
            }
          }
        })
    	}
    	else
    		console.error(new Error("You must put <KmlLayer /> components within a <Map /> context. Or provide the maps and map props manually."))
    }
    componentWillUnmount() {
    	if(this.state.KmlLayer)
	    	this.state.KmlLayer.setMap(null);

      if(this.listener) {
        this.listener.remove();
      }
    }
    render() {
    	if(this.state.KmlLayer && this.props.url != this.state.KmlLayer.url)
	    	this.state.KmlLayer.setUrl(this.props.url);
        return <div>KmlLayer</div>;
    }
}

KmlLayer.propTypes = {
	maps : PropTypes.object,
	map : PropTypes.object,
	zIndex : PropTypes.number.isRequired,
	preserveViewport : PropTypes.bool,
	screenOverlays : PropTypes.bool,
	suppressInfoWindows : PropTypes.bool,
	url : PropTypes.string.isRequired,
  onStatusChanged: PropTypes.func
}

export default KmlLayer;

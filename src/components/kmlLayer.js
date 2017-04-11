import React from 'react';

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
    	}
    	else
    		console.error(new Error("You must put <KmlLayer /> components within a <Map /> context. Or provide the maps and map props manually."))
    }
    componentWillUnmount() {
    	if(this.state.KmlLayer)
	    	this.state.KmlLayer.setMap(null);
    }
    render() {
    	if(this.state.KmlLayer && this.props.url != this.state.KmlLayer.url)
	    	this.state.KmlLayer.setUrl(this.props.url);
        return <div>KmlLayer</div>;
    }
}

KmlLayer.propTypes = {
	maps : React.PropTypes.object,
	map : React.PropTypes.object,
	zIndex : React.PropTypes.number.isRequired,
	preserveViewport : React.PropTypes.bool,
	screenOverlays : React.PropTypes.bool,
	suppressInfoWindows : React.PropTypes.bool,
	url : React.PropTypes.string.isRequired
}

export default KmlLayer;

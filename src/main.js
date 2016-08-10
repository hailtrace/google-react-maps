import React from 'react';
import ReactDom from 'react-dom';
import Map from './components/map';
import DataLayer from './components/dataLayer';
import KmlLayer from './components/kmlLayer';

import Feature from './components/feature';

import layers from '../test-data/test-layers';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'App';
        this.state = {
            layers,
            KmlUrl : "",
            KmlUrls : ["http://virtualglobetrotting.com/category/land/raceways-velodromes/export-0.kml", "http://www.nohrsc.noaa.gov/data/vector/master/st_us.kmz"]
        }

        this.removeLayer = this.removeLayer.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        console.log(layers);
        this.mutateFeature = this.mutateFeature.bind(this);

    }
    mutateFeature(geoJson, layerIndex, featureIndex) {
        var {layers} = Object.assign({}, this.state);
        layers[layerIndex].geoJson.features[featureIndex] = geoJson;
        this.setState({layers});
    }
    removeLayer(index) {
        var {layers} = Object.assign({}, this.state);
        layers = layers.slice(0,index).concat(layers.slice(index + 1, layers.length));
        this.setState({layers});
    }
    toggleVisibility(index) {
        var {layers} = Object.assign({}, this.state);
        layers[index].visible = !layers[index].visible;
        this.setState({layers});
    }
    render() {
        return (
        	<div>
        		<h1>Simple Map</h1>
        		<Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{ height:1000, width:1000}}>
        		</Map>
        		<h2>Simple Map with Data Layers</h2>
                {(()=>{
                    if(this.state.layers.length > 0)
                        return <ul>{this.state.layers.map((layer,index) => <li key={index}><button onClick={() => this.toggleVisibility(index)}>{layer.name}</button></li>)}</ul>
                })()}
        		<Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:1000, width:1000}}>
                    {this.state.layers.map((layer, layerIndex) => {
                        return <DataLayer zIndex={layerIndex + 1} key={layerIndex} visible={layer.visible}>
                            {layer.geoJson.features.map((feature, featureIndex) => <Feature editable={true} id={feature._id} onChange={geoJson => {
                                geoJson._id = feature._id; //Preserve my database _ids
                                this.mutateFeature(geoJson, layerIndex, featureIndex);
                            }} 
                                key={featureIndex} geoJson={feature} />)}
                        </DataLayer>
                    })}
        		</Map>
                {/*
                <h2>Simple Map with KML Layer</h2>
                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:1000, width:1000}}>
                    <KmlLayer zIndex={1} url="http://virtualglobetrotting.com/category/land/raceways-velodromes/export-0.kml" />
                </Map>

                <h2>Simple Map with KML Layer and Data Layers</h2>
                URL: <input type="text" value={this.state.KmlUrl} onChange={e => this.setState({KmlUrl : e.target.value})} />
                <button onClick={() => {
                    var KmlUrls = this.state.KmlUrls.slice();
                    KmlUrls.push(this.state.KmlUrl);
                    this.setState({
                        KmlUrl : "",
                        KmlUrls
                    });
                }}>Add</button>
                
                {(()=>{
                    if(this.state.KmlUrls.length > 0)
                        return (
                            <ul>{this.state.KmlUrls.map((url, index) => <li onClick={() => {
                                var KmlUrls = this.state.KmlUrls.slice();
                                KmlUrls = KmlUrls.slice(0,index).concat(KmlUrls.slice(index+1,KmlUrls.length));
                                this.setState({KmlUrls});
                            }} key={index}>{url}</li>)}</ul>
                        )
                })()}

                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:1000, width:1000}}>
                    {this.state.layers.map((layer, index) => {
                        return <DataLayer zIndex={1} key={index} visible={layer.visible}>
                            {layer.geoJson.features.map((feature, index) => <Feature editable={true} id={feature._id} key={index} geoJson={feature} />)}
                        </DataLayer>
                    })}
                    {this.state.KmlUrls.map((url, index) => <KmlLayer key={index} url={url} zIndex={index} />)}

                </Map>*/}

        	</div>
        );
    }
}


ReactDom.render(<App />, document.getElementById('entry-point'))

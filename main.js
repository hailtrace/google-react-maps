import React from 'react';
import ReactDom from 'react-dom';
import {Map, InfoWindow, Marker} from './src/components/index';
import DataLayer from './src/components/dataLayer';
import KmlLayer from './src/components/kmlLayer';

import Feature from './src/components/feature';

import layers from './test-data/test-layers';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'App';
        this.state = {
            layers : layers,
            KmlUrl : "",
            KmlUrls : ["http://virtualglobetrotting.com/category/land/raceways-velodromes/export-0.kml", "http://www.nohrsc.noaa.gov/data/vector/master/st_us.kmz"],
            showInfoWindow : true,
            center : {
                lat : 39.5,
                lng : -58.35
            },
            zoom : 4
        }

        this.removeLayer = this.removeLayer.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        console.log("Test Data Layers: ", layers);
        this.mutateFeature = this.mutateFeature.bind(this);
        this.simulateFeatureCoordinateEdit = this.simulateFeatureCoordinateEdit.bind(this);
    }
    componentDidMount() {
        // setInterval(()=>this.setState({layers : this.state.layers}), 1000);
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
    //Test: What happens when an individual coordinate in the geoJson features gets edited.
    //Expected Result: The <Feature /> components each internally figure out whether or not they should update their geometry. 
    simulateFeatureCoordinateEdit() {
        var layers = this.state.layers.slice();
        layers[0].geoJson.features[0].geometry.coordinates[0].forEach((coordinate, index) => {
            layers[0].geoJson.features[0].geometry.coordinates[0][index] = [coordinate[0] + 5, coordinate[1] + 5];
        })
        this.setState({layers});
    }
    render() {
        return (
        	<div>
        		<h1>Simple Map</h1>
                <div>
            		Zoom : <input type="number" onChange={e => this.setState({zoom : Number(e.target.value)})} value={this.state.zoom} />
                </div>
                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" zoom={Number(this.state.zoom)} center={this.state.center} style={{ height:1000, width:1000}}>
        		</Map>


        		<h2>Simple Map with Data Layers</h2>
                {(()=>{
                    if(this.state.layers.length > 0)
                        return <ul>{this.state.layers.map((layer,index) => <li key={index}><button onClick={() => this.toggleVisibility(index)}>{layer.name}</button></li>)}</ul>
                })()}
                <button onClick={this.simulateFeatureCoordinateEdit}>Simulate External Map Change</button>
        		<Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:1000, width:1000}}>
                    {this.state.layers.map((layer, layerIndex) => {
                        return <DataLayer zIndex={layerIndex + 1} key={layerIndex} visible={layer.visible}>
                            {layer.geoJson.features.map((feature, featureIndex) => 
                                <Feature 
                                    editable={true} 
                                    id={feature._id} 
                                    onChange={geoJson => {
                                        geoJson._id = feature._id; //Preserve my database _ids
                                        this.mutateFeature(geoJson, layerIndex, featureIndex);
                                    }} 
                                    onClick={(id, coords) => {
                                        console.log("Feature clicked: ", id, coords);
                                    }}
                                    key={featureIndex} 
                                    geoJson={feature} />
                            )}
                        </DataLayer>
                    })}
        		</Map>

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

                </Map>

                <h2>Simple Map with InfoWindow</h2>
                {(()=>{
                    var toggle = () => this.setState({showInfoWindow : !this.state.showInfoWindow});
                    if(this.state.showInfoWindow)
                        return <button onClick={toggle}>Hide Markers</button>
                    else
                        return <button onClick={toggle}>Show Markers</button>
                })()}
                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height: 1000, width: 1000}}>
                    {(()=>{
                        if(this.state.showInfoWindow)
                            return (
                                
                                    <InfoWindow open={true} coords={{lng: -115.44364929199219, lat: 45.058001435398296}}>
                                        <div>This is a regular old infowindow.</div>
                                        <div>With components rendered inside of it.</div>
                                        <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:150, width:300}} />
                                    </InfoWindow>
                            )
                    })()}
                    <Marker coords={{lng: -117.44364929199219, lat: 40.058001435398296}}>
                        <InfoWindow open={true}>
                            <div>This is a component within a marker.</div>
                        </InfoWindow> 
                    </Marker>
                    <Marker icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" coords={{lng: -100.44364929199219, lat: 30.058001435398296}}>
                        <InfoWindow open={true}>
                            <div>This marker has an icon image.</div>
                        </InfoWindow> 
                    </Marker>


                </Map>

        	</div>
        );
    }
}


ReactDom.render(<App />, document.getElementById('entry-point'))

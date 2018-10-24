import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import {Map, DataLayer, Feature, InfoWindow, CustomOverlay, Marker, MarkerCluster, MapControl, SearchBox, Circle} from './src/components/index';
import {ControlPosition} from './src/utils/utils';
import KmlLayer from './src/components/kmlLayer';
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
            zoom : 4,
            customControls : [],
            circleCenter : {lng: -100.44364929199219, lat: 30.058001435398296},
            markerNumber : 10,
            searchBoxVisible: true,
        }

        this.bounds = JSON.parse(localStorage.getItem('bounds')) || null;
        this.removeLayer = this.removeLayer.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        console.log("Test Data Layers: ", layers);
        this.mutateFeature = this.mutateFeature.bind(this);
        this.simulateFeatureCoordinateEdit = this.simulateFeatureCoordinateEdit.bind(this);
        this.toggleSearchbox = this.toggleSearchbox.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.infoWindowMap = null;
    }
    componentDidMount() {
        var controls = [];
        var positions = Object.getOwnPropertyNames(ControlPosition);
        positions.forEach(p => {
            controls.push(
                <MapControl position={p}>
                    <div style={{backgroundColor:"#fff"}}>
                        <h3>{p}</h3>
                    </div>
                </MapControl>
            );
        })
        var Wrapper = (props) => (<div style={{backgroundColor:"red",padding:"10px"}}>{props.children}</div>);
        controls.push(<SearchBox wrapper={Wrapper} onPlacesChanged={pl => console.log("Places: ", pl)} position="TOP_CENTER" />)

        this.setState({customControls : controls})
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
            layers[0].geoJson.features[0].properties.fillColor = '#000000';
        })
        this.setState({layers});
    }

    handleMapClick(e) {
        var geocoder = this.infoWindowMap.getGeocoder();
        var maps = this.infoWindowMap.getGoogleMapsApi();

        var location = {lng : e.latLng.lng(), lat: e.latLng.lat()};
        geocoder.geocode({location}, (results,status) => {
            if(status === maps.GeocoderStatus.OK) {
                var {formatted_address} = results[0];
                var show_geocode_infowindow = true;
                var geocode_infowindow_coords = location;
                this.setState({formatted_address, show_geocode_infowindow, geocode_infowindow_coords});
            }
        })
    }
    toggleSearchbox() {
      this.setState(state => ({ searchBoxVisible: !state.searchBoxVisible }));
    }
    render() {
        const { searchBoxVisible } = this.state;
        var controls = [];
        var Wrapper = (props) => (<div style={{backgroundColor:"red",padding:"15px"}}>{props.children}</div>);
        if (searchBoxVisible) {
          controls.push(<SearchBox wrapper={Wrapper} onPlacesChanged={pl => console.log("Places: ", pl)} position="TOP_CENTER" />)
        }
        var positions = Object.getOwnPropertyNames(ControlPosition);
        positions.forEach(p => {
            controls.push(
                <MapControl position={p}>
                    <div style={{backgroundColor:"#fff"}}>
                        <h3>{p}</h3>
                    </div>
                </MapControl>
            );
        })
        return (
        	<div>
        		<h1>Simple Map</h1>
                <div>
            		Zoom : <input type="number" onChange={e => this.setState({zoom : Number(e.target.value)})} value={this.state.zoom} />
                </div>

                <Map onClick={e => console.log(e)} api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" zoom={Number(this.state.zoom)} center={this.state.center} style={{ height:1000, width:1000}}>
                    <CustomOverlay style={{background: "#fff", padding: "5px 10px"}} coords={this.state.center}>
                        <h1>Custom Overlay!</h1>
                        <p>This is the beginning of the custom overlay.</p>
                        <p>You can now create your own custom react component-driven google maps overlays. (Woah, slow down charlie. You're going to fast.)</p>
                    </CustomOverlay>
        		</Map>

                <h2>Simple Map with Custom Controls</h2>
                <button onClick={() => this.toggleSearchbox()}>Toggle Searchbox</button>
                <Map
                    api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw"
                    zoom={Number(this.state.zoom)}
                    center={this.state.center}
                    style={{ height:1000, width:1000}}
                    controls={controls}
                    >

                </Map>

        		<h2>Simple Map with Data Layers</h2>
                {(()=>{
                    if(this.state.layers.length > 0)
                        return <ul>{this.state.layers.map((layer,index) => <li key={index}><button onClick={() => this.toggleVisibility(index)}>{layer.name}</button></li>)}</ul>
                })()}
                <button onClick={this.simulateFeatureCoordinateEdit}>Simulate External Map Change</button>
        		<Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:500, width:500}}>
                    {this.state.layers.map((layer, layerIndex) => {
                        return <DataLayer onCreate={e => console.log('Creating: ', e)} onClick={e => console.log(e.id, e.coords)} zIndex={layerIndex + 1} key={layerIndex} visible={layer.visible}>
                            {layer.geoJson.features.map((feature, featureIndex) =>
                                <Feature
                                    fastEditing={true}
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
                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:500, width:500}}>
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

                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:500, width:500}}>
                    {this.state.layers.map((layer, index) => {
                        return <DataLayer zIndex={1} onClick={e => console.log(e.id,e.coords)} key={index} visible={layer.visible}>
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
                <Map ref={map => {this.infoWindowMap = map}} onClick={this.handleMapClick} api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height: 500, width: 500}}>
                    {(()=>{
                        if(this.state.showInfoWindow)
                            return (

                                    <InfoWindow open={this.state.show_geocode_infowindow} onCloseClick={e => this.setState({show_geocode_infowindow : false})} coords={this.state.geocode_infowindow_coords}>
                                        <div>This is a regular old infowindow. {this.state.showInfoWindow}</div>
                                        <div>With components rendered inside of it.</div>
                                        <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" style={{height:150, width:300}} />
                                    </InfoWindow>
                            )
                    })()}
                    <Marker coords={{lng: -117.44364929199219, lat: 40.058001435398296}}>
                        <InfoWindow open={this.state.showInfoWindow}>
                            <div>This is a component within a marker.{this.state.showInfoWindow.toString()}</div>
                        </InfoWindow>
                    </Marker>
                    <Marker icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" coords={{lng: -100.44364929199219, lat: 30.058001435398296}}>
                        <InfoWindow open={true}>
                            <div>This marker has an icon image.</div>
                        </InfoWindow>
                    </Marker>


                </Map>
                <h1>Simple Map with shapes</h1>
                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" bounds={this.bounds} style={{height: 500, width: 500}}>
                    <Circle editable={true} fillColor="#fff" strokeColor="#112233" radius={500000} center={this.state.circleCenter} onCenterChange={coords => {console.log(coords); this.setState({circleCenter : coords});}} onRadiusChange={radius => {}}>
                        <InfoWindow open={true}>
                            <h1>Test</h1>
                        </InfoWindow>
                    </Circle>
                </Map>
                <h1>Simple Map with marker clusterer</h1>
                <input type="number" value={this.state.markerNumber}  onChange={e => this.setState({markerNumber : e.target.value})} />
                <Map api-key="AIzaSyCWuH5SGDikY4OPSrbJxqTi4Y2uTgQUggw" bounds={this.bounds} onbounds_changed={(bounds) => {
                    this.bounds = bounds
                    localStorage.setItem('bounds', JSON.stringify(bounds));
                }} style={{height: 500, width: 500}}>
                    <MarkerCluster options={{gridSize: 50, maxZoom: 15}}>
                        {(()=>{
                            var markers = [];
                            for (var i = 0; i < this.state.markerNumber; i++) {
                                markers.push(
                                    <Marker key={i} icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" coords={{lng: -100.44364929199219 + i / 100, lat: 30.058001435398296 + i / 100}}>
                                    </Marker>

                                )
                            };
                            return markers;
                        })()}

                    </MarkerCluster>
                </Map>
        	</div>
        );
    }
}


ReactDom.render(<App />, document.getElementById('entry-point'))

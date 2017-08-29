import React from 'react';
import {processPoints} from '../utils/utils';

class DataLayer extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'DataLayer';
        this.state = {
          data : null
        }

        this.initDataLayer = this.initDataLayer.bind(this);

        //Prop Checking
        this.checkPropVisibility = this.checkPropVisibility.bind(this);
        this.checkPropDrawingMode = this.checkPropDrawingMode.bind(this);

        //Style
        this.styleFeatures = this.styleFeatures.bind(this);

        //Focus
        this.focus = this.focus.bind(this);

    }
    /** Focus the map on this dataLayer's features. */
    focus(){
        var {maps,map} = this.props;
        var bounds = new maps.LatLngBounds();
        if(this.state.data) {
            this.state.data.forEach((feature)=>{
                processPoints(feature.getGeometry(), bounds.extend, bounds);
            });
            map.fitBounds(bounds);
        }
    }
    initDataLayer(cb) {
      var {map, maps} = this.props;

    var dataOptions = {
      map
       }

       if(this.props.dataOptions)
         dataOptions = Object.assign(dataOptions, this.props.dataOptions);

       dataOptions = Object.assign(dataOptions, {
         style : this.styleFeatures,
         featureFactory: item => {
           return new maps.Data.Feature({
             geometry: item,
             id: '___INTERNAL_BRAND_NEW___'
           });
         },
       })

       var dataLayer = new maps.Data(dataOptions)

       //If there is geoJSON, initialize it.
       if(this.props.geoJson) {
         var options = { idPropertyName : '_id' };
         if(this.props.idPropertyName)
           options.idPropertyName = this.props.idPropertyName;

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
       this.setState({ data : dataLayer }, cb);

    }

    checkPropVisibility(nextProps) {
      var {visible} = this.props;

      if(!visible && nextProps.visible) {
        this.state.data.setMap(this.props.map);
      }
      else if(visible && !nextProps.visible)
        this.state.data.setMap(null);
    }
    checkPropDrawingMode(props) {
      const { drawingMode } = props;
      if(!this.state.data) return;
      if(!drawingMode) {
        return this.state.data.setDrawingMode(null);
      }
      return this.state.data.setDrawingMode(drawingMode);
    }
    styleFeatures(feature) {
      //If they passed in a function to completely overide style features, then do so.

      if(this.props.styleFeatures)
        return this.props.styleFeatures(feature);

        var geo = feature.getGeometry();
        var type = null;
        if(geo)
            type = geo.getType();

        var visible = feature.getProperty('visible');
        var zIndex = feature.getProperty('zIndex');
        var strokeColor = feature.getProperty('strokeColor');
        var fillColor = feature.getProperty('fillColor');
        var fillOpacity = this.props.fillOpacity;

        //Do some logic on the options to make things a bit easier.
        if(!strokeColor)
          strokeColor = fillColor;

        zIndex = zIndex? zIndex : 10;

        if(this.props.zIndex)
          zIndex = zIndex + (10000 * this.props.zIndex) //TODO: Find a better way to separate out layer zIndexes. Right now we are defautling to 10000K features in a GeoJson schema. It works, but there should be a better way.

        switch(type) {
          case 'Polygon':
            var polyOptions = {
              strokeWeight : 1,
              strokeColor,
              fillColor,
              fillOpacity
            } //Potential Enhancement: Polyoptions could have different defaults. For now, we will leave this.

            if(typeof visible !== 'undefined')
              polyOptions.visible = true;
            if(typeof zIndex !== 'undefined');
              polyOptions.zIndex = zIndex;
            return polyOptions;
          default:
            return {}
        }
    }
    componentWillMount() {
      if(this.props.maps && this.props.map) {
        this.initDataLayer(f => {
          this.checkPropVisibility(this.props);
          this.checkPropDrawingMode(this.props);
        });
      }
      else
        console.error(new Error("You must put this compenent in a <Map /> context component or provide the maps and map props manually."))
    }
    componentDidMount() {
      this.state.data.addListener('addfeature', event => {
        if(this.props.drawingMode) {
          if(this.props.onCreate) {
            if(event.feature.getId() == '___INTERNAL_BRAND_NEW___') {
              event.feature.toGeoJson(jj => {
                this.props.onCreate(jj, event.feature);
                setTimeout(f => {
                  const createdFeature = this.state.data.getFeatureById(event.feature.getId());
                  this.state.data.remove(createdFeature);
                }, 100);
              });
            }
          }
        }
      })
    }
    componentWillUnmount() {
      this.state.data.setMap(null);
      this.setState({data : null})
    }
    componentDidUpdate(prevProps, prevState) {

    }
    componentWillReceiveProps(nextProps) {
      if(typeof nextProps.visible !== 'undefined') {
         this.checkPropVisibility(nextProps);
         this.checkPropDrawingMode(nextProps);
      }
    }
     shouldComponentUpdate(nextProps, nextState) {
       return true;
     }
     componentWillUpdate(nextProps, nextState) {
     }
    render() {
      var children = []

      if(this.state.data) {
        children = React.Children.map(this.props.children, child => React.cloneElement(child, {
          maps : this.props.maps,
          map : this.props.map,
          data : this.state.data
        }));
      }
        return <div>{children}</div>;
    }
}

DataLayer.propTypes = {
    maps : React.PropTypes.object,
    map : React.PropTypes.object,
    dataOptions : React.PropTypes.object,
    geoJson : React.PropTypes.object,
    visible : React.PropTypes.bool,
    onChange : React.PropTypes.func,
    styleFeatures : React.PropTypes.func,
    zIndex : React.PropTypes.number.isRequired,
    fillOpacity : React.PropTypes.number,
    onCreate: React.PropTypes.func,
    drawingMode: React.PropTypes.oneOf([ 'Point', 'LineString', 'Polygon' ])
}

export default DataLayer;

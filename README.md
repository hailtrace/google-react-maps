# google-react-maps
version 1.1.31

A new approach to the google maps api using react.

To install `npm install google-react-maps`

Things you can import:
```javascript
import {
  Map, 
  KmlLayer,
  DataLayer,
  Feature,
  InfoWindow,
  CustomOverlay,
  Marker,
  MapControl,
  SearchBox
} from 'google-react-maps';
```

# Usage

Using the map is fairly simple. Most commonly you would set it up like this:

```javascript
import React from 'react';
import PropTypes from 'prop-types';

class App extends React.Component {
  render() {
    return (
      <Map 
        api-key='your api url'
        onMount={(map, maps) => {
          this.map = map; //Store the google map instance for custom actions. (Outside the react components.)
          this.maps = maps; //Store a reference to the google maps javascript api in case we need some of it's helper methods.
        }}
        optionsConstructor={function(maps) {
          //Options Constructor always has a this context of the options object. To override the default options do the following:
          Object.assign(this, {
            zoom : 4,
            mapTypeId : maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl : true,
            zoomControlOptions : {
                position: maps.ControlPosition.LEFT_CENTER
            },
            keyboardShortcuts : true,
            panControl: true,
            panControlOptions : {
                position : maps.ControlPosition.BOTTOM_RIGHT
            },
            mapTypeId : maps.MapTypeId.HYBRID,
            mapTypeControl : true,
            mapTypeControlOptions : {
                position: maps.ControlPosition.LEFT_BOTTOM
            },
            fullscreenControlOptions : {
                position: maps.ControlPosition.RIGHT_BOTTOM
            },
            fullscreenControl: true
          });
        }}
        >
        //Any components passed as children get the maps and map props passed to them.
      </Map>
    )
  }
}

```

See main.js inside the git project to understand how to implement everything. (Uncomment some components to see everything)

To run the dev mode... `webpack-dev-server` after doing a `npm install`

[Documentation](https://nomadgraphix.github.io/google-react-maps)

##General Goals

So, the general goals for this project would be to see:

- A truly component driven google maps api integration into react in which each component is a black-box (or not completely library interdependent). In theory, a component could be just as easily added to a "non-react or partial-react" implementation of Google maps. 
- A useful mapping of react components that reflects the powerfully layered nature of the google maps api. ([See layers](https://developers.google.com/maps/documentation/javascript/layers))
- A specifically engineered DataLayer component that maps to and edits any GeoJSON object in the react way. (state + action => new state) The DataLayer is a key for this project because we want specific control over minute pieces of a GeoJSON object. 

## Contributing Rules

- You are welcome to contribute!
- I will approve all changes that fit within the vision for this project. Make sure that you do not try to add specific-to-you changes that don't help enhance the general project. 
- I will handle versioning and npm. We use [Semver](https://docs.npmjs.com/getting-started/semantic-versioning)

## To-dos

Below are the list of things we need to get done. They don't necessarily need to happen in order.

### Implementation

For v2.0.0:

 - Add ability for icons to change size depending on map zoom-level. (For instance when zoomed way out, I would like the icon to be slightly bigger than when zoomed all the way in.) [See this section of the google docs](https://developers.google.com/maps/documentation/javascript/markers#complex_icons)
 - Add all possible GeoJSON shapes to the DataLayer component. (Polygon is the only implemented one right now.)
 - Create all Shape components. [See Shapes](https://developers.google.com/maps/documentation/javascript/shapes)
 - Add a CustomOverlay class/component that allows us to do things similar to InfoWindows but with completely custom styles. [See Custom Overlays](https://developers.google.com/maps/documentation/javascript/customoverlays) <---- Started this. First iteration done!


### Documentation

 - Finish documenting exisiting features.
 - Create a wiki for documenting here on github.
 - Create example files and folders.
 - Create testing environment and test components using mochajs or some other good framework. (My bad for not starting this as test driven.)

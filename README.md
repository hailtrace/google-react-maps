# google-react-maps
version 1.1.2

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
  MapControl
} from 'google-react-maps';
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

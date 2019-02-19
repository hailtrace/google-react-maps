import React from 'react';
const mapsapi = require('google-maps-api');

export const getMapsApi = (options, callback) => {
  if (!options.libraries) console.warn(`Please provide a list of libraries to include in the maps api.`);
  if (!options.apiKey) throw new Error('Api key must be provided.');

  mapsapi(options.apiKey, options.libraries || [])().then(api => {
    callback(api);
  }).catch(error => console.error(error));
}

export default function useGoogleMaps({ apiKey, libaries }) {
  const [ maps, setMaps ] = React.useState(null);

  React.useEffect(() => {
    if (apiKey) {
      getMapsApi({ apiKey, libraries }, maps => setMaps(maps));
    }
  }, [
    apiKey
  ]);

  return maps;
}

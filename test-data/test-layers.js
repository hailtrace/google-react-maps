import collections from './feature-collections';

const layers = collections.map((geoJson, index) => {
	return {
		name : "Data Layer " + index,
		visible : true,
		geoJson
	}
});

export default layers;
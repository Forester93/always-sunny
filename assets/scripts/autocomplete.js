const LOC_IQ_API_TOKEN = "pk.11e208428afdad5f9849a6cfb3281ac3";
/**
 * Uses Location IQ to search for places beginning with the letters entered in the location textbox
 * @param {*} query The entered location
 * @param {*} callback Callback that displays the result from the fetch response
 */
const onSearch = async (query, callback) => {
    const response = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${LOC_IQ_API_TOKEN}&q=${query}&limit=5`);
    const results = await response.json();

    const cities = results.map((res) => {
        return{ 
            value: res.lat + ";" + res.lon,
            text: res.display_name 
        };
    });
    
    callback(cities);
}
const debouncedOnSearch = _.debounce(onSearch, 500); //free version of locationIQ only allows 2 requests per second.

/**
 * Initializes the autocomplete
 */
const initAutoComplete = () => {
    const selectedLocEl = $('#locationInput');

    selectedLocEl.autoComplete({
        resolver: 'custom',
        events: {
            search: debouncedOnSearch,
        },
    });

    selectedLocEl.on('autocomplete.select', (event,  selected) => {
        const latLon = selected.value.split(';');
        selectedLocEl.attr("data-lat", latLon[0]);
        selectedLocEl.attr("data-lon", latLon[1]);
    });
}

/**
 * When document is ready, initialize the autocomplete
 */
$(document).ready(() => {
    initAutoComplete();
    
});
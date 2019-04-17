// require csvtojson
const csv = require("csvtojson");

// Convert a csv file with csvtojson
const csv1 = csv().fromFile('./Barcelona1.csv');
const csv2 = csv().fromFile('./barcelona2.csv');

//when parse finished, result will be emitted here.
Promise.all([csv1, csv2]).then(([arr1, arr2]) => {
    console.time();
    const unionArr = getOnlyNeededFields(union(arr1, arr2));
    console.timeEnd();
    //default: 15.986ms

    console.log('unionArr', unionArr.length) //unionArr 8529

    console.time();
    const unionAllArr = getOnlyNeededFields(unionAll(arr1, arr2));
    console.timeEnd();
    //default: 10.728ms

    console.log('unionAllArr', unionAllArr.length) //unionAllArr 9929
});

const union = (arr1, arr2) => {
    const uniqElems = {};

    return [
        ...arr1.filter(el => filterUniqElements(el, uniqElems)),
        ...arr2.map(getIdFromUrl)
                .filter(el => filterUniqElements(el, uniqElems)),
    ];
};


const unionAll = (arr1, arr2) => [
    ...arr1,
    ...arr2.map(getIdFromUrl),
];

const filterUniqElements = (el, uniqElems) => {
    const currElem = uniqElems[el.id];
    if (currElem) {
        const isEqualEl = currElem.name === el.name &&
            currElem.zipcode === el.zipcode &&
            currElem.smart_location === el.smart_location &&
            currElem.country === el.country &&
            currElem.latitude === el.latitude &&
            currElem.longitude === el.longitude;

        if (isEqualEl) {
            return false;
        }
    }
    uniqElems[el.id] = el;
    return true;
}

const getIdFromUrl = (obj) => {
    const urlArr = obj.listing_url.split('/');
    const id = urlArr[urlArr.length - 1];
    const newData = Object.assign({}, obj, {id});
    delete newData.listing_url;
    return newData;
}

const getOnlyNeededFields = (arr) => {
    return arr.map(({name, latitude, longitude}) => ({name, latitude, longitude}));
}
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
    //default: 971.482ms

    console.log('unionArr', unionArr.length) //unionArr 8520

    console.time();
    const unionAllArr = getOnlyNeededFields(unionAll(arr1, arr2));
    console.timeEnd();
    //default: 17.985ms

    console.log('unionAllArr', unionAllArr.length) //unionAllArr 9929
});

const union = (arr1, arr2) => [
    ...arr1,
    ...arr2.filter(el => !arr1.find(arr1El => el.listing_url.includes(arr1El.id)))
        .map(getIdFromUrl),
];

const unionAll = (arr1, arr2) => [
    ...arr1,
    ...arr2.map(getIdFromUrl),
];

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
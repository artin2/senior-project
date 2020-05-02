// CITATION: https://stackoverflow.com/questions/37230555/get-with-query-string-with-fetch-in-react-native
function queryString(query) {
  // get array of key value pairs ([[k1, v1], [k2, v2]])
  const qs = Object.entries(query)
    // filter pairs with undefined value
    .filter(pair => pair[1] !== undefined)
    // encode keys and values, remove the value if it is null, but leave the key
    .map(pair => pair.filter(i => i !== null).map(encodeURIComponent).join('='))
    .join('&');

  return qs && '?' + qs;
}


function getCategories() {
  return [{ name: "Nail Salon" },{ name: "Hair Salon" },{ name: "Facials" },{ name: "Barbershops"},
  {name: "Spa & Wellness"}, {name: "Makeup"}];
}

function getCategoriesAsPairs() {
  return [{ value: 'Nails', label: "Nail Salon" },{ value: 'Hair', label: "Hair Salon" },
  { value: "Facials", label: "Facials" },{ value: "Barbershops", label:"Barbershops"},
  {value: "Spa", label: "Spa & Wellness" }, {value: "Makeup", label: "Makeup" }];
}

function shorterVersion(name) {
  if(name == "Spa & Wellness") {
    return "Spa"
  }
  else if(name == "Barbershops") {
    return "Barber"
  }
  else if(name == "Nail Salon") {
    return "Nails"
  }
  else if(name == "Hair Salon") {
    return "Hair"
  }
  return name;
}

function longerVersion(name) {
  if(name == "Spa") {
    return "Spa & Wellness"
  }
  else if(name == "Barber") {
    return "Barbershops"
  }
  else if(name == "Nails") {
    return "Nail Salon"
  }
  else if(name == "Hair") {
    return "Hair Salon"
  }
  return name;
}

 exports.queryString = queryString;
 exports.getCategories = getCategories;
 exports.shorterVersion = shorterVersion;
 exports.longerVersion = longerVersion;
 exports.getCategoriesAsPairs = getCategoriesAsPairs;

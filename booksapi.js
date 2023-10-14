const apikey = "NNQUA2UWTMM5Ih2T7Wv0Roub9oAjoI9c";
const domain = "https:\\api.nytimes.com/svc/books/v3/lists/";
const dataapi = () => {
  return fetch(`${domain}overview.json?api-key=${apikey}`)
    .then((res) => res.json)
    .then((data) => {
      return data;
    });
};

const datafilterbydate = (filterdate, filtertitle) => {
  let api = `${domain}${filterdate}/${filtertitle}.json?api-key=${apikey}`;
  return fetch(api)
    .then((res) => res.json)
    .then((data) => {
      return data;
    });
};

const similarbookapi = (listname) => {
  let api = `${domain}current/${listname}.json?api-key=${apikey}`;
  return fetch(api)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

export { datafilterbydate, similarbookapi, dataapi };

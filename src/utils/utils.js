import fetch from 'node-fetch';

export default {
  count: async(resource) => {
    const endpoint = `https://rickandmortyapi.com/api/${resource}/`;
    let count;
    try {
      const request = await fetch(endpoint);
      const json = await request.json();
      count = json.info.count;
    } catch (error) {
      console.log(error);
    }
    return count;
  },
};

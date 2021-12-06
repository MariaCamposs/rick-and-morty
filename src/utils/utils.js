import fetch from 'node-fetch';

export default {
  count: async(endpoint) => {
    const route = `https://rickandmortyapi.com/api/${endpoint}/`;
    let count;
    try {
      const request = await fetch(route);
      const json = await request.json();
      count = json.info.count;
    } catch (error) {
      console.log(error);
    }
    return count;
  },
};
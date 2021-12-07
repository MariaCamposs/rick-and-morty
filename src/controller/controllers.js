import sequelize from '../database.js';

const exercise = {
  resources: async (char, resource) => {
    const results = { char, count: null, resource };
    const names = await sequelize.query(`SELECT name FROM ${resource}s WHERE 1;`, { type: 'SELECT' });
    const resourceNames = names.map(item => item.name);
    results.count = resourceNames.join('').match(new RegExp(char, 'gi')).length;
    return results
  },
  charCounter: async () => {
    const response = { exercise_name: '', time: null, in_time: null, results: null };
    const result = [];
    const timeStart = new Date();
    try {
      result.push(await exercise.resources('l', 'location'));
      result.push(await exercise.resources('e', 'episode'));
      result.push(await exercise.resources('c', 'character'));
    } catch (error) {
      console.log(error);
    } finally {
      const seconds = Math.floor((new Date() - timeStart) / 1000);
      const milliseconds = Math.abs((new Date() - timeStart) / 100);

      response.exercise_name = 'Char counter';
      response.time = `${seconds}s ${milliseconds}ms`;
      seconds >= 3 ? response.in_time = false : response.in_time = true;
      response.results = result;
      return response;
    };
  },
  episodeLocations: async () => {
    const response = { exercise_name: '', time: null, in_time: null, results: null };
    const result = [];
    const timeStart = new Date();
    try {
      const episodes = await sequelize.query(`
        SELECT name, episode, characters FROM episodes WHERE 1;`, { type: 'SELECT' });

      const response = await Promise.all(episodes.map(async (episode) => {
        const charactersIds = episode.characters.split(',');
        const origins = await Promise.all(charactersIds.map(async (id) =>
          (await sequelize.query(
            `SELECT origin FROM characters WHERE id = ${id};`, { type: "SELECT" }
          ))[0].origin)
        );
        const noRepeatOrigins = [...new Set(origins)];
        return { name: episode.name, episode: episode.episode, locations: noRepeatOrigins };
      }));
      result.push(response);
    } catch (error) {
      console.log(error);
    } finally {
      const seconds = Math.floor((new Date() - timeStart) / 1000);
      const milliseconds = Math.abs((new Date() - timeStart) / 100);

      response.exercise_name = 'Episode locations';
      response.time = `${seconds}s ${milliseconds}ms`;
      seconds >= 3 ? response.in_time = false : response.in_time = true;
      response.results = result;
      return response;
    };
  },
  rmchallenge: async (req, res) => {
    const result = [];
    result.push(await exercise.charCounter());
    result.push(await exercise.episodeLocations());
    res.status(200).json(result);
  },
};

export default exercise;

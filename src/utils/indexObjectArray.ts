/**
 * Index an array of objects using value of specified key as index key.
 * Expects only one match for each key.
 */
export const indexObjectArray = (data: unknown[], key: string) => {
  return data.reduce((result, item) => {
    result[item[key]] = item;
    return result;
  }, {});
};

/**
 * Index an array of objects using value of specified key as index key.
 * Expects multiple matches for each key and thus returns an array for each key.
 */
export const indexObjectArrayMultiple = (data: unknown[], key: string) => {
  return data.reduce((result, item) => {
    if (!result[item[key]]) result[item[key]] = [];
    result[item[key]].push(item);
    return result;
  }, {});
};

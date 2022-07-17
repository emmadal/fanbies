import { updateCustomLink, getCookie } from "api";

const jtoken = getCookie("fanbies-token");

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= result.length; i++) {
    if (i !== undefined) {
      const obj = { ...result[i] };
      // eslint-disable-next-line camelcase
      const { link_order, ...rest } = obj;
      const newObj = { ...rest, link_order: i };
      // eslint-disable-next-line no-loop-func
      updateCustomLink(jtoken, newObj).then(() => {});
    }
  }
  return result;
};

export const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `Item ${k + 1}`,
  }));

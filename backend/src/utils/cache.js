import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 600, // default 10 mins
});

export default cache;
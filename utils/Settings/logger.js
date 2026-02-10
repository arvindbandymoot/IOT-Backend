const isDev = process.env.NODE_ENV !== "Production";

module.exports = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  error: (...args) => {
    console.error(...args); // always log errors
  }
};

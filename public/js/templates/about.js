const templateAbout = (args = { who: 'Dave' }) => {
  return `
    <h1>About ${args.who}</h1>
    <chrono-timeradd></chrono-timeradd>
  `;
};

module.exports = templateAbout;

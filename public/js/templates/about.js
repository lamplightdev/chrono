const templateAbout = (args = { who: 'Dave' }) => {
  return `
    <h1>About ${args.who}</h1>
    <kleene-timeradd></kleene-timeradd>
  `;
};

module.exports = templateAbout;

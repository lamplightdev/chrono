(() => {
  const templateAbout = (args = { who: 'Dave' }) => {
    return `
      <h1>About ${args.who}</h1>
    `;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = templateAbout;
  } else {
    window.templateAbout = templateAbout;
  }
})();

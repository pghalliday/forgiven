export function plugin(setup) {
  return (description) => {
    return setup({
      description: description,
      beforeEach: () => `beforeEach: ${description}`,
      afterEach: () => `afterEach: ${description}`,
    });
  };
};

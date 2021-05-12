const sortArrayAlphabetically = (array) => {
  return array.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (aLower < bLower) {
      return -1;
    }
    if (aLower < bLower) {
      return 1;
    }
    return 0;
  });
};

export default sortArrayAlphabetically;

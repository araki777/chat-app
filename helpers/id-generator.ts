const idGenerator = () => {
  return Math.random().toString().substring(2, 18);
};

export default idGenerator;

const slug = string => {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/ /g, '-');
};

export default slug;

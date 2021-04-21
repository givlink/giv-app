export const parseDate = dateStr => {
  let d = new Date(dateStr); //ISO format

  if (d == "Invalid Date") {
    d = new Date(parseInt(dateStr)); //Timestamp format
  }
  return d;
};

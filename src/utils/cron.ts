export const priorityNumber = (date: Date) => {
  const dateNum = new Date(date).getDate();
  const dateDiff = dateNum - new Date().getDate();

  switch (dateDiff) {
    case 0:
      return 0;

    case 1:
      return 1;

    case 2:
      return 1;

    case 3:
      return 2;

    case 4:
      return 2;

    default:
      return 3;
  }
};

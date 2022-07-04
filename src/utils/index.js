/**
 * Reuseable utility const / function for the application
 */
export const defaultProfilePic =
  "https://fanbiesapp.s3.eu-west-2.amazonaws.com/2019-03-13/1552479858884_209.png";

export const renderDateStamp = (stamp) => {
  // Convert timestamp to milliseconds
  const monthsArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(stamp * 1000);

  // Year
  const year = date.getFullYear();

  // Month
  const month = monthsArray[date.getMonth()];

  // Day
  const day = date.getDate();

  // Display date time in MM-dd-yyyy h:m:s format
  const convdataTime = `${month}-${day}-${year}`;

  return convdataTime;
};

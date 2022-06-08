export default function renderDateStamp(stamp) {
  // Convert timestamp to milliseconds
  var months_arr = [
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
    "Dec"
  ];

  var date = new Date(stamp * 1000);

  // Year
  var year = date.getFullYear();

  // Month
  var month = months_arr[date.getMonth()];

  // Day
  var day = date.getDate();

  // Display date time in MM-dd-yyyy h:m:s format
  const convdataTime = `${month}-${day}-${year}`;

  return convdataTime;
}

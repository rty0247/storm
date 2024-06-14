const sequelize = require('../config/db');

exports.getTotalOutflow = async (req, res) => {
  const { clientId, zoneId, fromDate, toDate } = req.body;

  try {
    // Call the stored procedure
    const result = await sequelize.query('CALL USP_GetTotalOutFlowKPI(:clientId, :zoneId, :fromDate, :toDate)', {
      replacements: { clientId, zoneId, fromDate, toDate },
      type: sequelize.QueryTypes.RAW
    });

    const dates = getDatesBetween(fromDate, toDate);
    let count = 0;
    const readingsMap = new Map();

    // Sum readings and store them in a map
    result.forEach(reading => {
      if (reading.Reading > 0) {
        count += reading.Reading;
      }
      readingsMap.set(reading.ReadingDate, reading.Reading);
    });

    // Round the count to the nearest multiple of 500
    const roundedCount = Math.round(count / 500) * 500;

    // Ensure each date in the range has a reading
    const readings = dates.map(date => {
      const reading = readingsMap.get(date) || 0;
      return {
        date: date,
        count: reading
      };
    });

    res.status(200).json({
      minRange: 0,
      maxRange: roundedCount,
      difference: 200,
      totalOutFlow: readings
    });
  } catch (error) {
    console.error('Error fetching Total Out Flow details:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching Total Out Flow details.',
      error: error.message
    });
  }
};

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]); // Store dates in 'YYYY-MM-DD' format
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

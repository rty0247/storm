const sequelize = require('../config/db');

exports.getAllMetersWithClientIdZoneIdAndDmaId = async (req, res) => {
  const { clientId, zoneId, dmaId } = req.body;

  try {
    const result = await sequelize.query('CALL USP_GetMeterDetails(:clientId, :zoneId, :dmaId)', {
      replacements: { clientId, zoneId, dmaId },
      type: sequelize.QueryTypes.RAW
    });

    const meterDetails = result.map(meter => ({
      meterId: meter.MeterID,
      gatewayId: meter.GatewayID,
      deveui: meter.DEVEUI,
      zoneNo: meter.Zone,
      dmaNo: meter.DMA,
      timestamp: meter.LastReceivedTimeStamp,
      reading: meter.LastReceivedReading,
      consumed: meter.Consumption,
      status: meter.status,
      batteryLife: meter.BatteryLife,
      remarks: meter.Remarks
    }));

    res.status(200).json({
      meters: meterDetails
    });
  } catch (error) {
    console.error('Error fetching Meter details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching Meter details.',
      error: error.message
    });
  }
};

exports.getMeterDetailsWithMeterId = async (req, res) => {
  const { clientId, zoneId, dmaId, meterId, fromDate, toDate } = req.body;

  try {
    const result = await sequelize.query(
      'CALL USP_GetMeterDetailAnalytics(:clientId, :zoneId, :dmaId, :meterId, :fromDate, :toDate)',
      {
        replacements: { clientId, zoneId, dmaId, meterId, fromDate, toDate },
        type: sequelize.QueryTypes.RAW
      }
    );

    if (result && result.length > 0) {
      const firstRow = result[0];

      const extendedSummary = {
        minUsagePerDay: firstRow.Minperday,
        maxUsagePerDay: firstRow.MaxperDay,
        avgUsagePerDay: firstRow.AvgperDay,
        medianUsagePerDay: firstRow.AvgperDay, // Assuming median is the same as average for this example
        backFlowIndex: [
          {
            date: "2024-05-02",
            value: "5.830"
          },
          {
            date: "2024-05-01",
            value: "0.990"
          }
        ],
        batteryLife: [
          {
            date: "2024-05-03",
            value: "7 Years"
          },
          {
            date: "2024-05-02",
            value: "7 Years"
          },
          {
            date: "2024-05-01",
            value: "7 Years"
          }
        ]
      };

      const usageDetails = result.map(row => ({
        date: row.ReadingDate,
        value: row.Reading
      }));

      res.status(200).json({
        extendedSummary: extendedSummary,
        usage: usageDetails
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No meter details found.'
      });
    }
  } catch (error) {
    console.error('Error fetching Meter details:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching Meter details.',
      error: error.message
    });
  }
};

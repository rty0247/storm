const sequelize = require('../config/db');

exports.getAllGatewaysWithClientId = async (req, res) => {
    const { clientId } = req.body;

    try {
        const result = await sequelize.query('CALL USP_GetGatewayDetailsByClient(:clientId)', {
            replacements: { clientId },
            type: sequelize.QueryTypes.RAW
        });
        const gatewayDetails = result.map(gateway => {          
            return {
              gatewayId: gateway.gwid,
              time: gateway.time,
              ethState: getStateValue(gateway.ethState),
              lteState: getStateValue(gateway.lteState),
              temperature: gateway.temperature,
              powerState: getStateValue(gateway.powerState),
              batteryState: getStateValue(gateway.batteryState),
              batteryLevel: gateway.batteryLevel,
              batteryVoltage: gateway.batteryVoltage,
              status: gateway.status
            };
          });
        res.status(200).json({
            gatewayDetails: gatewayDetails
        });
    } catch (error) {
        console.error('Error fetching client details:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching client details.',
            error: error.message
        });
    }
};

const getStateValue = (state) => {
    if (Buffer.isBuffer(state)) {
      return state.readUInt8(0);
    }
    return 0;
  };

exports.getGatewayDetailsWithClientIdAndGatewayId = async (req, res) => {
    const { clientId, gatewayId } = req.body;

    try {
        const result = await sequelize.query(
            'CALL USP_GetGatewayDetailsByGatewayID(:clientId, :gatewayId)',
            {
                replacements: { clientId, gatewayId },
                type: sequelize.QueryTypes.RAW
            }
        );

        if (result && result[0]) {
            const data = result[0]; // Assuming the first element in the result array contains the data

            const basicDetails = {
                id: data.GatewayID,
                type: data.Type,
                subnet: data.Subnet,
                ceacon: data.Ceacon,
                transmittingPower: data.TransmittingPower,
                createdTime: data.CreatedTime,
                name: data.GatewayName,
                region: data.Region,
                beacon: data.Beacon,
                gdtp: data.GDTP,
                http: data.HTTP,
                remarks: data.Remarks
            };

            const lastFrameData = {
                devAddress: data.DevAddress,
                frequency: data.Frequency,
                sNR: data.SNR,
                BW: data.BW,
                gpsTime: data.GPSTime,
                type: data.FrameType,
                rssi: data.RSSI,
                sf: data.SF,
                loraMod: data.LoraMod,
                remarks: data.Remarks
            };

            res.status(200).json({
                basicDetails: basicDetails,
                lastFrameData: lastFrameData
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No gateway details found.'
            });
        }
    } catch (error) {
        console.error('Error fetching gateway details:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching gateway details.',
            error: error.message
        });
    }
};

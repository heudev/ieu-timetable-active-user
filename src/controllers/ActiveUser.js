const ActiveUser = require('../models/ActiveUser');
const { getCurrentTime } = require('../utils/helper');

class ActiveUserController {
    async getMaxActiveUserCount() {
        try {
            const record = await ActiveUser.findOne();
            return record ? record.maxActiveUserCount : 0;
        } catch (error) {
            console.error('Error fetching max active user count:', error);
            return 0;
        }
    }

    async getMaxActiveUserTime() {
        try {
            const record = await ActiveUser.findOne();
            return record ? record.maxActiveUserTime : null;
        } catch (error) {
            console.error('Error fetching max active user time:', error);
            return null;
        }
    }

    async updateMaxActiveUserCount(newMax) {
        try {
            let record = await ActiveUser.findOne();

            if (record) {
                record.maxActiveUserCount = newMax;
                record.maxActiveUserTime = getCurrentTime();
                await record.save();
            } else {
                await ActiveUser.create({
                    maxActiveUserCount: newMax,
                    maxActiveUserTime: getCurrentTime()
                });
            }
        } catch (error) {
            console.error('Error updating max active user count:', error);
        }
    }
}

module.exports = new ActiveUserController();

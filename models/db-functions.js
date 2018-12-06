module.exports = function (models) {
    const { Track } = models;
    const milliseconds = {
        hour: 3.6e6,
        day: 8.64e7,
        week: 6.048e8,
        month: 2.628e9,
        year: 3.154e10
    }
    function minimumDate(period) { // period: string -- {unit},{quantity}
        const [unit, quantity] = period.split(',');
        if (unit) {
            const date = new Date(Date.now() - milliseconds[unit] * (quantity || 1));
            return date;
        } else {
            return null;
        }
    }
    /*  
        getFeed(period: string, users: string[])
            period -- time period to filter tracks
                {unit of time},{quantity} (e.g. "week,3")
                    default quantity is 1
                    if period is falsy, tracks are not filtered based on time period
                        (i.e. period is 'All' or 'All Time')
    
            users -- array of user ids to filter tracks
    */
    function getFeed(period, users) {
        return new Promise((resolve, reject) => {
            const conditions = {};
            try {
                if (period) {
                    conditions._postedAt = { $gte: minimumDate(period) }
                }
                if (users) {
                    conditions.user = { $in: users }
                }
                Track.find(conditions).populate('user')
                    .then(resolve).catch(reject)
            } catch (err) {
                reject(err);
            }
        })
    }

    return {
        getFeed
    }
}
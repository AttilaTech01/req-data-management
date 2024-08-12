import reqService from '../services/req-service';
import schedule from 'node-schedule';

const rule = new schedule.RecurrenceRule();
rule.minute = 4;
const job = schedule.scheduleJob(rule, async function () {
    const data = await reqService.nameTransfer();
    console.log('The merge Was executed');
});

module.exports = job;

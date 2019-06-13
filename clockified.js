#!/usr/bin/env node

var rp = require('request-promise');
var moment = require('moment-business-days');
var momentTz = require('moment-timezone');
var extend = require('extend');
var PromiseBB = require("bluebird");
moment.updateLocale('pt-BR', {
   workingWeekdays: [1, 2, 3, 4, 5]
});

module.exports = function(params, callback) {
    'use strict';

    extend({
      "startWorkingHour": 9,
      "workingHours": 8,
      "description": "Arquitetura"
    }, params)

    const httpRequest = {
        uri: `https://api.clockify.me/api/v1/workspaces/${params.workspaceId}/time-entries`,
        method: 'POST',
        headers: {"X-Api-Key":params.apiKey,"Content-Type":"application/json; charset=utf-8", "User-Agent": 'node ' + process.version},
        body: {}
    };

    var startFrom = moment(params.startFrom).set({hour:params.startWorkingHour,minute:0,second:0,millisecond:0});
    var untilTo = moment(params.untilTo).set({hour:params.startWorkingHour+params.workingHours,minute:0,second:0,millisecond:0});
    var nextDayToFill = startFrom;
    var rpPromises = []
    while (nextDayToFill.isBefore(untilTo)) {
      if (nextDayToFill.isBusinessDay()) {
        rpPromises.push(rp(extend(true, {}, httpRequest, {body: `{"start":"${momentTz(nextDayToFill).tz('GMT').format()}","billable":true,"description":"${params.description}","projectId":"${params.projectId}","taskId":null,"end":"${momentTz(nextDayToFill.add(params.workingHours, 'h')).tz('GMT').format()}","tagIds":null}`})))
      }
      nextDayToFill = nextDayToFill.nextBusinessDay().set({hour:params.startWorkingHour,minute:0,second:0,millisecond:0});
    }

    PromiseBB.map(rpPromises, function(item) {
        return item
      }, {
        concurrency: 2
      }).then(results => {
        console.log(JSON.stringify(results))
        console.log("Timesheet was fullfilled successfully")
      }).catch(err => {
        console.log(JSON.stringify(err))
      })
}

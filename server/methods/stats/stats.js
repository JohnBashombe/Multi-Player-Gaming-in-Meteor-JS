import { Meteor } from "meteor/meteor";

// History Columns

// id - GameId - setterId - playerId - games(total) - choice1 - choice2 - choice3- status(won, lost) - 
// amount(user Games) - profit (in BTC) - challengeId - challengeTeam - created_at

Meteor.methods({

    'loadStats': () => {
        return loadStats();
    }
});

const loadStats = () => {

    let year = new Date().getFullYear(); let month = new Date().getMonth() + 1; let day = new Date().getDate();
    let todayDate = month + '/' + day + '/' + year;

    let arrayResult = [];

    // Fetch the amount for BLUE PURPLE GREEN
    let bpg = 0;
    History.find({ $and: [{ 'choice1': 'b', 'choice2': 'p', 'choice3': 'g', 'status': 'won', 'todayDate': todayDate }] }).map((doc) => {
        bpg = bpg + doc.amount;
    });

    // Fetch the amount for BLUE PURPLE GREEN
    let bpgLost = 0;
    History.find({ $and: [{ 'choice1': 'b', 'choice2': 'p', 'choice3': 'g', 'status': 'lost', 'todayDate': todayDate }] }).map((doc) => {
        bpgLost = bpgLost + doc.amount;
    });

    // Fetch the amount for BLUE PURPLE GREEN
    let bpgTotal = 0;
    History.find({ $and: [{ 'choice1': 'b', 'choice2': 'p', 'choice3': 'g', 'todayDate': todayDate }] }).map((doc) => {
        bpgTotal = bpgTotal + doc.amount;
    });

    // Fetch the amount for BLUE PURPLE GREEN
    let bgpLost = 0;
    History.find({ $and: [{ 'choice1': 'b', 'choice2': 'g', 'choice3': 'p', 'status': 'lost', 'todayDate': todayDate }] }).map((doc) => {
        bgpLost = bgpLost + doc.amount;
    });

    // Fetch the amount for BLUE PURPLE GREEN
    let bgp = 0;
    History.find({ $and: [{ 'choice1': 'b', 'choice2': 'g', 'choice3': 'p', 'status': 'won', 'todayDate': todayDate }] }).map((doc) => {
        bgp = bgp + doc.amount;
    });

    // Fetch the amount for BLUE PURPLE GREEN
    let bgpTotal = 0;
    History.find({ $and: [{ 'choice1': 'b', 'choice2': 'g', 'choice3': 'p', 'todayDate': todayDate }] }).map((doc) => {
        bgpTotal = bgpTotal + doc.amount;
    });

    // Fetch the amount for PURPLE BLUE GREEN
    let pbg = 0;
    History.find({ $and: [{ 'choice1': 'p', 'choice2': 'b', 'choice3': 'g', 'status': 'won', 'todayDate': todayDate }] }).map((doc) => {
        pbg = pbg + doc.amount;
    });

    // Fetch the amount for PURPLE BLUE GREEN
    let pbgLost = 0;
    History.find({ $and: [{ 'choice1': 'p', 'choice2': 'b', 'choice3': 'g', 'status': 'lost', 'todayDate': todayDate }] }).map((doc) => {
        pbgLost = pbgLost + doc.amount;
    });

    let pbgTotal = 0;
    History.find({ $and: [{ 'choice1': 'p', 'choice2': 'b', 'choice3': 'g', 'todayDate': todayDate }] }).map((doc) => {
        pbgTotal = pbgTotal + doc.amount;
    });

    // Fetch the amount for PURPLE GREEN BLUE
    let pgb = 0;
    History.find({ $and: [{ 'choice1': 'p', 'choice2': 'g', 'choice3': 'b', 'status': 'won', 'todayDate': todayDate }] }).map((doc) => {
        pgb = pgb + doc.amount;
    });

    // Fetch the amount for PURPLE GREEN BLUE
    let pgbLost = 0;
    History.find({ $and: [{ 'choice1': 'p', 'choice2': 'g', 'choice3': 'b', 'status': 'lost', 'todayDate': todayDate }] }).map((doc) => {
        pgbLost = pgbLost + doc.amount;
    });

    // Fetch the amount for PURPLE GREEN BLUE
    let pgbTotal = 0;
    History.find({ $and: [{ 'choice1': 'p', 'choice2': 'g', 'choice3': 'b', 'todayDate': todayDate }] }).map((doc) => {
        pgbTotal = pgbTotal + doc.amount;
    });

    // Fetch the amount for GREEN BLUE PURPLE
    let gbp = 0;
    History.find({ $and: [{ 'choice1': 'g', 'choice2': 'b', 'choice3': 'p', 'status': 'won', 'todayDate': todayDate }] }).map((doc) => {
        gbp = gbp + doc.amount;
    });

    // Fetch the amount for GREEN BLUE PURPLE
    let gbpLost = 0;
    History.find({ $and: [{ 'choice1': 'g', 'choice2': 'b', 'choice3': 'p', 'status': 'lost', 'todayDate': todayDate }] }).map((doc) => {
        gbpLost = gbpLost + doc.amount;
    });

    // Fetch the amount for GREEN BLUE PURPLE
    let gbpTotal = 0;
    History.find({ $and: [{ 'choice1': 'g', 'choice2': 'b', 'choice3': 'p', 'todayDate': todayDate }] }).map((doc) => {
        gbpTotal = gbpTotal + doc.amount;
    });

    // Fetch the amount for GREEN PURPLE BLUE
    let gpb = 0;
    History.find({ $and: [{ 'choice1': 'g', 'choice2': 'p', 'choice3': 'b', 'status': 'won', 'todayDate': todayDate }] }).map((doc) => {
        gpb = gpb + doc.amount;
    });

    // Fetch the amount for GREEN PURPLE BLUE
    let gpbLost = 0;
    History.find({ $and: [{ 'choice1': 'g', 'choice2': 'p', 'choice3': 'b', 'status': 'lost', 'todayDate': todayDate }] }).map((doc) => {
        gpbLost = gpbLost + doc.amount;
    });

    let gpbTotal = 0;
    History.find({ $and: [{ 'choice1': 'g', 'choice2': 'p', 'choice3': 'b', 'todayDate': todayDate }] }).map((doc) => {
        gpbTotal = gpbTotal + doc.amount;
    });

    if (bpgTotal === 0) bpgTotal = 1;
    if (bgpTotal === 0) bgpTotal = 1;
    if (pbgTotal === 0) pbgTotal = 1;
    if (pgbTotal === 0) pgbTotal = 1;
    if (gbpTotal === 0) gbpTotal = 1;
    if (gpbTotal === 0) gpbTotal = 1;

    // BPG and BGP
    arrayResult[0] = (bpg * 100) / bpgTotal; arrayResult[1] = (bgp * 100) / bgpTotal;
    // PBG and PGB
    arrayResult[2] = (pbg * 100) / pbgTotal; arrayResult[3] = (pgb * 100) / pgbTotal;
    // GBP and GPB
    arrayResult[4] = (gbp * 100) / gbpTotal; arrayResult[5] = (gpb * 100) / gpbTotal;
    // BPG and BGP
    arrayResult[6] = (bpgLost * 100) / bpgTotal; arrayResult[7] = (bgpLost * 100) / bgpTotal;
    // PBG and PGB
    arrayResult[8] = (pbgLost * 100) / pbgTotal; arrayResult[9] = (pgbLost * 100) / pgbTotal;
    // GBP and GPB
    arrayResult[10] = (gbpLost * 100) / gbpTotal; arrayResult[11] = (gpbLost * 100) / gpbTotal;

    return arrayResult;
}

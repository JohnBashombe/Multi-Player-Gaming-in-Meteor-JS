import { Meteor } from "meteor/meteor";

minimumCost = () => { return 0.000199 } // in BTC
// minimumCost = () => { return 1 } // For Testing Only
couponCredit = () => { return (minimumCost() * 0.2); } // in BTC 20 % of the minimum cost for playing

withdrawLimit = () => { return (minimumCost()); }

profitDegree = () => { return 75 };

Meteor.methods({

    'loadCost': () => {
        return minimumCost();
    }

});
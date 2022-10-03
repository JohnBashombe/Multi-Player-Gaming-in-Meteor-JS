
// remove the default rate limit on login, create user and reset password
Accounts.removeDefaultRateLimit();

// this piece of code prevent the system from brute force login
// i.e. its prevents the user for guessing many passwords  for a single account
// if detected , the system will ask you to slow down for 20s before trying again

let preventBruteForeLogin = {
    type: 'method',
    name: 'login',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventBruteForeLogin, 5, 10000);
DDPRateLimiter.setErrorMessage("error. Retry in 10s");

// prevent the system for adding more users than expected
// it stops the user for 30s
let preventAddingManyUser = {
    type: 'method',
    name: 'addUser',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventAddingManyUser, 2, 10000);
DDPRateLimiter.setErrorMessage("error. Retry in 10s");


let preventResetPasswordManyTimes = {
    type: 'method',
    name: 'reset',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventResetPasswordManyTimes, 3, 10000);
DDPRateLimiter.setErrorMessage("error. Retry in 10s");

// allow the user to update to try to update his password 5 times every 30s
let preventUpdatePasswordManyTimes = {
    type: 'method',
    name: 'updatePassword',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventUpdatePasswordManyTimes, 5, 10000);
DDPRateLimiter.setErrorMessage("error. Retry in 10s");

// prevent the user for loading his games multiple times
let preventMultipleLoadingUserGames = {
    type: 'method',
    name: 'loadUserGame',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventMultipleLoadingUserGames, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent the user for loading free games multiple times
let preventMultipleLoadingThisGame = {
    type: 'method',
    name: 'loadThisGame',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventMultipleLoadingThisGame, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// You can create a challenge once in 10s
let preventAddingTooManyChallenges = {
    type: 'method',
    name: 'addChallenge',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventAddingTooManyChallenges, 1, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// You can close a challenge once in 1 minute
let preventClosingTooManyChallenges = {
    type: 'method',
    name: 'closeChallenge',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventClosingTooManyChallenges, 1, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent the user for sending too much request
let preventJoiningTooManyChallenges = {
    type: 'method',
    name: 'joinTeam',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventJoiningTooManyChallenges, 1, 2000);
DDPRateLimiter.setErrorMessage("error. Retry in 2s");

// prevent loading too many request
let preventLoadingTooManyChallenges = {
    type: 'method',
    name: 'loadChallenges',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventLoadingTooManyChallenges, 20, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent searching too many times
let preventSearchingTooManyTimes = {
    type: 'method',
    name: 'searchChallenge',
    connectionId() {
        return true
    },
}

DDPRateLimiter.addRule(preventSearchingTooManyTimes, 18, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent sending too many messages
let preventSendingTooManyMessages = {
    type: 'method',
    name: 'sendMessage',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventSendingTooManyMessages, 1, 5000);
DDPRateLimiter.setErrorMessage("error. Retry in 5s");

// prevent adding too many games
let preventAddingTooManyGames = {
    type: 'method',
    name: 'loadNewGame',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventAddingTooManyGames, 5, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Cancelling too many games
let preventCancelTooManyGames = {
    type: 'method',
    name: 'cancelGame',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventCancelTooManyGames, 1, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading Balance too many times
let preventLoadingBalanceFaster = {
    type: 'method',
    name: 'loadBalance',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingBalanceFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading Balance too many times
let preventLoadingMaxFaster = {
    type: 'method',
    name: 'userMax',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingMaxFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading Coupon too many times
let preventLoadingCouponFaster = {
    type: 'method',
    name: 'loadCoupon',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingCouponFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading Total cost Id too many times
let preventLoadingTotalIdFaster = {
    type: 'method',
    name: 'totalCostId',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingTotalIdFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading History Faster
let preventLoadingHistoryFaster = {
    type: 'method',
    name: 'loadHistory',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingHistoryFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading History Details Faster
let preventLoadingHistoryDetailsFaster = {
    type: 'method',
    name: 'loadHistoryDetails',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingHistoryDetailsFaster, 5, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading Last Challenge Details Faster
let preventLoadingLastChallengeFaster = {
    type: 'method',
    name: 'lastChallenge',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingLastChallengeFaster, 2, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading Username Faster
let preventLoadingUsernameFaster = {
    type: 'method',
    name: 'loadUsername',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingUsernameFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Loading Username Faster
let preventLoadingUsernameGameFaster = {
    type: 'method',
    name: 'loadUserGame',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingUsernameGameFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent Updating User password, you can only try 5 times in 10s
let preventPasswordUpdate = {
    type: 'method',
    name: 'updateUserPassword',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventPasswordUpdate, 5, 10000);
DDPRateLimiter.setErrorMessage("error. Retry in 10s");

// prevent loading the user code faster
let preventLoadUserCode = {
    type: 'method',
    name: 'loadUserCode',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadUserCode, 1, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 10s");

// prevent loading the games stats faster
let preventLoadingStatsFaster = {
    type: 'method',
    name: 'loadStats',
    connectionId() {
        return true
    }
}

DDPRateLimiter.addRule(preventLoadingStatsFaster, 5, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent loading the bitcoin address faster
let preventLoadingAddressFaster = {
    type: 'method',
    name: 'loadBtcAddress',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingAddressFaster, 5, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent loading the user transaction faster
let preventLoadingUserTransactionFaster = {
    type: 'method',
    name: 'loadUserTransaction',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingUserTransactionFaster, 5, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent loading the user withdraw faster
let preventLoadingWithdrawFaster = {
    type: 'method',
    name: 'withdraw',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventLoadingWithdrawFaster, 15, 30000);
DDPRateLimiter.setErrorMessage("error. Retry in 30s");

// prevent sending and trying guessing faster
let preventSendingBitcoinFaster = {
    type: 'method',
    name: 'sendBitcoin',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventSendingBitcoinFaster, 15, 30000);
DDPRateLimiter.setErrorMessage("error. Retry in 30s");

// prevent loading the total win faster
let preventTotalWinFaster = {
    type: 'method',
    name: 'totalWin',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventTotalWinFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent loading the total cost faster
let preventTotalCostFaster = {
    type: 'method',
    name: 'totalCost',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventTotalCostFaster, 10, 1000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent cancelling aa transaction multiple times
let preventClosingOneTransactionTwice = {
    type: 'method',
    name: 'cancelTransaction',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventClosingOneTransactionTwice, 1, 5000);
DDPRateLimiter.setErrorMessage("error. Retry in 1s");

// prevent cancelling aa transaction multiple times
let preventConnectingCoinbase = {
    type: 'method',
    name: 'updateBalance',
    userId(userId) {
        if (userId) {
            return true;
        }
    }
}

DDPRateLimiter.addRule(preventConnectingCoinbase, 1, 60000);
DDPRateLimiter.setErrorMessage("error. Retry in 60s");
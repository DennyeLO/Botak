const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
require('dotenv').config();

const { generateToken } = require("./Util/tokenGenerator")
const User = require("./Model/User")

const pubsub = new PubSub();

// Database
require("./Database/db");

// express server
const app = express();

// middlewares
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(bodyParser.json({ limit: '5mb' }));

// typeDefs
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './Graphql/TypeDefs')));
// resolvers
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './Graphql/Resolvers')));

// graphql server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res, payload }) => ({ req, res, payload, pubsub })
});

// applyMiddleware method connects ApolloServer to a specific HTTP framework ie: express
apolloServer.applyMiddleware({ app, cors: false });

// server
const httpserver = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpserver);

// rest endpoint
app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid
    if (!token) {
        return res.send({ ok: false, accessToken: "" })
    }
    let payload = null
    try {
        payload = jwt.verify(token, process.env.REFRESH_KEY)
    } catch (err) {
        console.log(err)
        return res.send({ ok: false, accessToken: "" })
    }
    const user = await User.findOne({ where: { id: payload.id } })
    if (!user) {
        return res.send({ ok: false, accessToken: "" })
    }

    return res.send({
        ok: true, accessToken: generateToken(user)
    })
})

app.get('/7card_pick', function (req, res) {
    const NUM_CARDS_IN_DECK = 54;
    const NUM_VALUES_IN_DECK = 13;
    const NUM_SUITS_IN_DECK = 4;
    const NUM_CARDS_IN_HAND = 7;
    const ACE_VALUE = Math.pow(2, 13);
    const STRAIGHT_LOW_ACE_INDICATOR = parseInt("10000000011110", 2);
    const TEN_CARD_POSITION = 8;
    const RANK_BASE_VALUE = Math.pow(10, 9);

    const NUM_CARDS_IN_HAND_JOKER = 6;
    const NUM_CARDS_IN_HAND_MULTI_JOKER = 5;
    let checkDeck = Array.from(new Array(NUM_CARDS_IN_DECK), () => false);

    let deck1;
    const buildDeck = (hand) => {
        if (hand) {
            return deck1.filter(item => !hand.includes(item));
        }
        let deck = Array.from(new Array(NUM_CARDS_IN_DECK), (_, index) => index);
        let count = NUM_CARDS_IN_DECK + 1;
        while ((count -= 1)) {
            deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
        }
        deck1 = deck;
        return deck;
    };

    let a = 0;
    let i = 0;
    let max = 0;
    let uniq;
    let step = Math.random() < 0.5;
    let prevCard;
    let card;
    let deckCard = buildDeck();
    let hand = [deckCard.pop()];
    checkDeck[hand[0]] = true;

    const Random = (max, min) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    if (hand[0] == 52 || hand[0] == 53) {

    }

    if (!step) {
        while (a <= 3) {
            i = a;
            max = a + 2;
            if (max == 4) {
                max = max + 1;
            }
            // console.log("max", max);
            if (i == 3) {
                hand.splice(i, 0, buildDeck(hand).pop());
                checkDeck[card] = true;
                // console.log("four", hand);
                break;
            }
            if (hand[i] == 5 || hand[i] == 18 || hand[i] == 31 || hand[i] == 44) {
                uniq = true;
            }
            if (i > 0) {
                prevCard = buildDeck(hand).pop();
                hand.splice(i, 0, prevCard);
                checkDeck[prevCard] = true;
                // console.log("top", i, hand);
            }
            while (i <= max) {
                // console.log("check", i)
                if (hand[i] <= 4 && hand[i] >= 0) {
                    card = ((hand[i] + 13) * 2 + Random(16, 15));
                } else if (hand[i] <= 17 && hand[i] >= 13) {
                    card = ((hand[i] * 2 + Random(16, 15)))
                } else if (hand[i] <= 11 && hand[i] >= 7) {
                    card = (((hand[i] + 13) - 20) * 2 + Random(1, 0))
                } else if (hand[i] <= 24 && hand[i] >= 20) {
                    card = ((hand[i] - 20) * 2 + Random(1, 0))
                } else if (hand[i] <= 43 && hand[i] >= 39) {
                    card = ((hand[i] - 37) + hand[i] + Random(1, 0) - 13);
                } else if (hand[i] <= 30 && hand[i] >= 26) {
                    card = ((hand[i] + 13) - 37 + (hand[i] + 13) + Random(1, 0) - 13)
                } else if (hand[i] <= 50 && hand[i] >= 46) {
                    card = ((hand[i] - Random(33, 32)) + (hand[i] - 46))
                } else if (hand[i] <= 37 && hand[i] >= 33) {
                    card = (((hand[i] + 13) - Random(33, 32)) + ((hand[i] + 13) - 46))
                } else if (hand[i] == 5 || hand[i] == 18 || hand[i] == 31 || hand[i] == 44) {
                    let QK = [49, 50, 36, 37, 10, 11, 23, 24]
                    card = (QK[Random(7, 0)]);
                } else if (hand[i] == 6 || hand[i] == 19) {
                    card = (12)
                    if (i > 3) {
                        let eight = [0, 1, 12]
                        card = eight[Random(2, 0)];
                    }
                } else if (hand[i] == 32 || hand[i] == 45) {
                    let joker = [25, 52]
                    card = (joker[Random(1, 0)])
                } else if (hand[i] == 12 || hand[i] == 25) {
                    card = (Random(40, 39))
                } else if (hand[i] == 38 || hand[i] == 51) {
                    card = (Random(27, 26))
                } else if (hand[i] == 52 || hand[i] == 53) {
                    if (a == 1) {
                        let step2 = [51, 26, 27]
                        card = (step2[Random(2, 0)])
                    } else {
                        let joker = [38, 51]
                        card = (joker[Random(1, 0)])
                    }
                }
                if (checkDeck[card] != true && uniq == true) {
                    hand.push(card)
                    // console.log("uniq");
                    uniq = false;
                    break;
                } else if (uniq == true && checkDeck[card] == true) {
                    // console.log("uniq else");
                    continue;
                }
                if (i == max - 2 || i == max - 3) {
                    hand.push(card)
                    i = hand.length - 1
                    // console.log("tmp", i, hand)
                }
                else {
                    // console.log(checkDeck[card], i, card)
                    if (checkDeck[card] != true) {
                        hand.splice(i, 1, card);
                        checkDeck[card] = true;
                        // console.log("if", i, hand)
                        break;
                    } else {
                        hand.splice(hand.length - 1, 1);
                        i = (i - 1) / 2
                        // console.log("else", i, hand, card);
                        continue;
                    }
                }
            }
            a++;
        }
    } else {
        i = 0;
        max = 3;
        while (i <= max) {
            if (i > 0 && i < 3) {
                prevCard = buildDeck(hand).pop();
                hand.splice(i, 0, prevCard);
                checkDeck[prevCard] = true;
                // console.log("top", hand);
            }
            if (hand[i] <= 4 && hand[i] >= 0) {
                card = ((hand[i] + 13) * 2 + Random(16, 15));
            } else if (hand[i] <= 17 && hand[i] >= 13) {
                card = ((hand[i] * 2 + Random(16, 15)))
            } else if (hand[i] <= 11 && hand[i] >= 7) {
                card = (((hand[i] + 13) - 20) * 2 + Random(1, 0))
            } else if (hand[i] <= 24 && hand[i] >= 20) {
                card = ((hand[i] - 20) * 2 + Random(1, 0))
            } else if (hand[i] <= 43 && hand[i] >= 39) {
                card = ((hand[i] - 37) + hand[i] + Random(1, 0) - 13);
            } else if (hand[i] <= 30 && hand[i] >= 26) {
                card = ((hand[i] + 13) - 37 + (hand[i] + 13) + Random(1, 0) - 13)
            } else if (hand[i] <= 50 && hand[i] >= 46) {
                card = ((hand[i] - Random(33, 32)) + (hand[i] - 46))
            } else if (hand[i] <= 37 && hand[i] >= 33) {
                card = (((hand[i] + 13) - Random(33, 32)) + ((hand[i] + 13) - 46))
            } else if (hand[i] == 5 || hand[i] == 18 || hand[i] == 31 || hand[i] == 44) {
                let QK = [49, 50, 36, 37, 10, 11, 23, 24]
                card = (QK[Random(7, 0)]);
            } else if (hand[i] == 6 || hand[i] == 19) {
                card = (12)
            } else if (hand[i] == 32 || hand[i] == 45) {
                let joker = [25, 52]
                card = (joker[Random(1, 0)])
            } else if (hand[i] == 12 || hand[i] == 25) {
                card = (Random(40, 39))
            } else if (hand[i] == 38 || hand[i] == 51) {
                card = (Random(27, 26))
            } else if (hand[i] == 52 || hand[i] == 53) {
                if (a == 1) {
                    let step2 = [51, 26, 27]
                    card = (step2[Random(2, 0)])
                } else {
                    let joker = [38, 51]
                    card = (joker[Random(1, 0)])
                }
            }
            if (i == 3) {
                card = buildDeck(hand).pop();
                hand.splice(i, 0, card);
                checkDeck[card] = true;
                // console.log("four", hand);
            }
            else if (i > 0) {
                // console.log(checkDeck[card], i, card)
                if (checkDeck[card] != true) {
                    hand.push(card);
                    checkDeck[card] = true;
                    // console.log("if", hand)
                } else {
                    hand.splice(i, 1);
                    // console.log("else", hand, prevCard, card)
                    continue;
                }
            }
            else {
                hand.push(card)
                checkDeck[card] = true;
                // console.log("first", hand)
            }
            i++;
        }
    }

    const handDisplay = () => {
        const values = "23456789TJQKA";
        const suits = [`♣︎`, `♦︎`, `♥︎`, `♠︎`];
        return hand.reduce((obj, item) => {
            if (item == 52 || item == 53) {
                obj.push('Joker');
            } else {
                obj.push(
                    `${values[item % NUM_VALUES_IN_DECK]}${suits[Math.floor(item / NUM_VALUES_IN_DECK)]
                    }`
                );
            }
            return obj;
        }, []).join(" ");
    };

    const rankHand = () => {
        const array_joker = [];

        var suits = new Array(NUM_SUITS_IN_DECK).fill(0);
        var values = new Array(NUM_VALUES_IN_DECK).fill(0);
        hand.forEach((card) => {
            if (card == 52 || card == 53) {
                array_joker.push(card);
            }

            if (card !== 52 && card !== 53) {
                suits[Math.floor(card / NUM_VALUES_IN_DECK)] += 1;
                values[card % NUM_VALUES_IN_DECK] += 1;
            }
        });



        let rankValue = values.reduce(
            (total, val, index) =>
            (total +=
                ((val === 1 && Math.pow(2, index + 1)) || 0) +
                ((val > 1 && Math.pow(2, index + 1) * ACE_VALUE * val) || 0)),
            0
        );
        const firstCardIndex = values.findIndex((index) => index === 1);

        var num = 0;
        var result_straight = false;
        values.filter((count) => {
            if (count) {
                num = num + 1;
            }

            if (array_joker.length === 1 && count && num === 4) {
                result_straight = true;
            } else if (array_joker.length === 2 && count && num === 3) {
                result_straight = true;
            }
        });

        const ranks = {
            royal_flush: false,
            straight_flush: false,
            quads: values.some((count) => count === 4),
            full_house: values.filter((count) => count === 3).length === 1 &&
                values.filter((count) => count === 2).length === 1,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND),
            straight: values
                .slice(firstCardIndex, firstCardIndex + NUM_CARDS_IN_HAND)
                .filter((count) => count === 1).length === 5 ||
                rankValue === STRAIGHT_LOW_ACE_INDICATOR,
            trips: values.some((count) => count === 3),
            two_pairs: values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length === 1,
            pair: values[values.length - 1] === 2,
            high_card: true,
        };
        const ranks_joker = {
            royal_flush: false,
            straight_flush: false,
            pents: values.some((count) => count === 4),
            quads: values.some((count) => count === 3),
            full_house: values.filter((count) => count >= 2).length === 2 ||
                values.filter((count) => count >= 3).length === 1,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND_JOKER),
            straight: result_straight,
            trips: values.some((count) => count === 2),
            two_pairs: values.filter((count, index) => index >= 8 && count === 1).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length > 0 ||
                values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 1).length > 0 ||
                values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length > 0,
            pair: values[values.length - 1] === 1,
            high_card: true,
        };

        const rank_multiple_joker = {
            royal_flush: false,
            straight_flush: false,
            pents: values.some((count) => count >= 3),
            quads: values.some((count) => count >= 2),
            full_house: values.filter((count) => count === 3).length === 1,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND_MULTI_JOKER),
            straight: result_straight,
            trips: true,
            two_pairs: values.filter((count, index) => index >= 8 && count > 0).length > 0,
            pair: true,
            high_card: true,
        }

        if (array_joker.length === 1) {
            ranks_joker.straight_flush = ranks_joker.flush && ranks_joker.straight;
            ranks_joker.royal_flush = ranks_joker.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        } else if (array_joker.length === 2) {
            rank_multiple_joker.straight_flush = rank_multiple_joker.flush && rank_multiple_joker.straight;
            rank_multiple_joker.royal_flush = rank_multiple_joker.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        } else {
            ranks.straight_flush = ranks.flush && ranks.straight;
            ranks.royal_flush = ranks.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        }
        let rankIndex = 0;
        let rankDescription = "";

        if (array_joker.length === 1) {
            Object.keys(ranks_joker).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !ranks_joker[key];
            });
        } else if (array_joker.length === 2) {
            Object.keys(rank_multiple_joker).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !rank_multiple_joker[key];
            });
        }
        else {
            Object.keys(ranks).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !ranks[key];
            });
        }

        rankValue +=
            rankIndex * RANK_BASE_VALUE -
            ((rankValue === STRAIGHT_LOW_ACE_INDICATOR && ACE_VALUE - 1) || 0);
        rankDescription = rankDescription
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        return {
            hand,
            suits,
            values,
            rankValue,
            ranks: array_joker.length === 2 ? rank_multiple_joker : array_joker.length === 1 ? ranks_joker : ranks,
            rankDescription,
            step: step ? 1 : 2,
            display: handDisplay(hand),
        };
    };
    console.log(rankHand());

    res.json({
        data: 'you hit rest endpoint great!'
    });
});

app.get('/7card_random', function (req, res) {
    const NUM_CARDS_IN_DECK = 54;
    const NUM_VALUES_IN_DECK = 13;
    const NUM_SUITS_IN_DECK = 4;
    const NUM_CARDS_IN_HAND = 7;
    const ACE_VALUE = Math.pow(2, 13);
    const STRAIGHT_LOW_ACE_INDICATOR = parseInt("10000000011110", 2);
    const TEN_CARD_POSITION = 8;
    const RANK_BASE_VALUE = Math.pow(10, 9);

    const NUM_CARDS_IN_HAND_JOKER = 6;
    const NUM_CARDS_IN_HAND_MULTI_JOKER = 5;

    const buildDeck = () => {
        let deck = Array.from(new Array(NUM_CARDS_IN_DECK), (_, index) => index);
        let count = NUM_CARDS_IN_DECK + 1;
        while ((count -= 1)) {
            deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
        }
        return deck;
    };

    const hand = buildDeck().slice(Math.max(buildDeck().length - 7, 0));

    const handDisplay = () => {
        const values = "23456789TJQKA";
        const suits = [`♣︎`, `♦︎`, `♥︎`, `♠︎`];
        return hand.reduce((obj, item) => {
            if (item == 52 || item == 53) {
                obj.push('Joker');
            } else {
                obj.push(
                    `${values[item % NUM_VALUES_IN_DECK]}${suits[Math.floor(item / NUM_VALUES_IN_DECK)]
                    }`
                );
            }
            return obj;
        }, []).join(" ");
    };


    const rankHand = () => {
        const array_joker = [];

        var suits = new Array(NUM_SUITS_IN_DECK).fill(0);
        var values = new Array(NUM_VALUES_IN_DECK).fill(0);
        hand.forEach((card) => {
            if (card == 52 || card == 53) {
                array_joker.push(card);
            }

            if (card !== 52 && card !== 53) {
                suits[Math.floor(card / NUM_VALUES_IN_DECK)] += 1;
                values[card % NUM_VALUES_IN_DECK] += 1;
            }
        });



        let rankValue = values.reduce(
            (total, val, index) =>
            (total +=
                ((val === 1 && Math.pow(2, index + 1)) || 0) +
                ((val > 1 && Math.pow(2, index + 1) * ACE_VALUE * val) || 0)),
            0
        );
        const firstCardIndex = values.findIndex((index) => index === 1);

        var num = 0;
        var result_straight = false;
        values.filter((count) => {
            if (count) {
                num = num + 1;
            }

            if (array_joker.length === 1 && count && num === 4) {
                result_straight = true;
            } else if (array_joker.length === 2 && count && num === 3) {
                result_straight = true;
            }
        });

        const ranks = {
            royal_flush: false,
            straight_flush: false,
            quads: values.some((count) => count === 4),
            full_house: values.filter((count) => count === 3).length === 1 &&
                values.filter((count) => count === 2).length === 1,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND),
            straight: values
                .slice(firstCardIndex, firstCardIndex + NUM_CARDS_IN_HAND)
                .filter((count) => count === 1).length === 5 ||
                rankValue === STRAIGHT_LOW_ACE_INDICATOR,
            trips: values.some((count) => count === 3),
            two_pairs: values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length === 1,
            pair: values[values.length - 1] === 2,
            high_card: true,
        };
        const ranks_joker = {
            royal_flush: false,
            straight_flush: false,
            pents: values.some((count) => count === 4),
            quads: values.some((count) => count === 3),
            full_house: values.filter((count) => count >= 2).length === 2 ||
                values.filter((count) => count >= 3).length === 1,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND_JOKER),
            straight: result_straight,
            trips: values.some((count) => count === 2),
            two_pairs: values.filter((count, index) => index >= 8 && count === 1).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length > 0 ||
                values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 1).length > 0 ||
                values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length > 0,
            pair: values[values.length - 1] === 1,
            high_card: true,
        };

        const rank_multiple_joker = {
            royal_flush: false,
            straight_flush: false,
            pents: values.some((count) => count >= 3),
            quads: values.some((count) => count >= 2),
            full_house: values.filter((count) => count === 3).length === 1,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND_MULTI_JOKER),
            straight: result_straight,
            trips: true,
            two_pairs: values.filter((count, index) => index >= 8 && count > 0).length > 0,
            pair: true,
            high_card: true,
        }

        if (array_joker.length === 1) {
            ranks_joker.straight_flush = ranks_joker.flush && ranks_joker.straight;
            ranks_joker.royal_flush = ranks_joker.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        } else if (array_joker.length === 2) {
            rank_multiple_joker.straight_flush = rank_multiple_joker.flush && rank_multiple_joker.straight;
            rank_multiple_joker.royal_flush = rank_multiple_joker.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        } else {
            ranks.straight_flush = ranks.flush && ranks.straight;
            ranks.royal_flush = ranks.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        }
        let rankIndex = 0;
        let rankDescription = "";

        if (array_joker.length === 1) {
            Object.keys(ranks_joker).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !ranks_joker[key];
            });
        } else if (array_joker.length === 2) {
            Object.keys(rank_multiple_joker).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !rank_multiple_joker[key];
            });
        }
        else {
            Object.keys(ranks).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !ranks[key];
            });
        }

        rankValue +=
            rankIndex * RANK_BASE_VALUE -
            ((rankValue === STRAIGHT_LOW_ACE_INDICATOR && ACE_VALUE - 1) || 0);
        rankDescription = rankDescription
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        return {
            hand,
            suits,
            values,
            rankValue,
            ranks: array_joker.length === 2 ? rank_multiple_joker : array_joker.length === 1 ? ranks_joker : ranks,
            rankDescription,
            display: handDisplay(hand),
        };
    };

    console.log(rankHand());
    res.json({
        data: 'you hit rest endpoint great!'
    });
});

app.get('/rest', function (req, res) {
    const NUM_CARDS_IN_DECK = 54;
    const NUM_VALUES_IN_DECK = 13;
    const NUM_SUITS_IN_DECK = 4;
    const NUM_CARDS_IN_HAND = 5;
    const ACE_VALUE = Math.pow(2, 13);
    const STRAIGHT_LOW_ACE_INDICATOR = parseInt("10000000011110", 2);
    const TEN_CARD_POSITION = 8;
    const RANK_BASE_VALUE = Math.pow(10, 9);

    const NUM_CARDS_IN_HAND_JOKER = 4;
    const NUM_CARDS_IN_HAND_MULTI_JOKER = 3;

    const buildDeck = () => {
        let deck = Array.from(new Array(NUM_CARDS_IN_DECK), (_, index) => index);
        let count = NUM_CARDS_IN_DECK + 1;
        while ((count -= 1)) {
            deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
        }
        return deck;
    };

    // const hand = buildDeck().slice(Math.max(buildDeck().length - 5, 0));

    const hand = [11, 08, 36, 51, 53];

    const handDisplay = () => {
        const values = "23456789TJQKA";
        const suits = [`♣︎`, `♦︎`, `♥︎`, `♠︎`];
        return hand.reduce((obj, item) => {
            if (item == 52 || item == 53) {
                obj.push('Joker');
            } else {
                obj.push(
                    `${values[item % NUM_VALUES_IN_DECK]}${suits[Math.floor(item / NUM_VALUES_IN_DECK)]
                    }`
                );
            }
            return obj;
        }, []).join(" ");
    };


    const rankHand = () => {
        const array_joker = [];

        var suits = new Array(NUM_SUITS_IN_DECK).fill(0);
        var values = new Array(NUM_VALUES_IN_DECK).fill(0);
        hand.forEach((card) => {
            if (card == 52 || card == 53) {
                array_joker.push(card);
            }

            if (card !== 52 && card !== 53) {
                suits[Math.floor(card / NUM_VALUES_IN_DECK)] += 1;
                values[card % NUM_VALUES_IN_DECK] += 1;
            }
        });



        let rankValue = values.reduce(
            (total, val, index) =>
            (total +=
                ((val === 1 && Math.pow(2, index + 1)) || 0) +
                ((val > 1 && Math.pow(2, index + 1) * ACE_VALUE * val) || 0)),
            0
        );
        const firstCardIndex = values.findIndex((index) => index === 1);

        var num = 0;
        var result_straight = false;
        values.filter((count) => {
            if (count) {
                num = num + 1;
            }

            if (array_joker.length === 1 && num === 4) {
                result_straight = true;
            } else if (array_joker.length === 2 && num === 3) {
                result_straight = true;
            }
        });

        console.log("hai " + num, result_straight);

        const ranks = {
            royal_flush: false,
            straight_flush: false,
            quads: values.some((count) => count === 4),
            full_house: values.filter(Boolean).length === 2,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND),
            straight: values
                .slice(firstCardIndex, firstCardIndex + NUM_CARDS_IN_HAND)
                .filter((count) => count === 1).length === 5 ||
                rankValue === STRAIGHT_LOW_ACE_INDICATOR,
            trips: values.some((count) => count === 3),
            two_pairs: values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length === 1,
            pair: values[values.length - 1] === 2,
            high_card: true,
        };
        const ranks_joker = {
            royal_flush: false,
            straight_flush: false,
            pents: values.some((count) => count === 4),
            quads: values.some((count) => count === 3),
            full_house: values.filter(Boolean).length === 2,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND_JOKER),
            straight: result_straight,
            trips: values.some((count) => count === 2),
            two_pairs: values.filter((count, index) => index >= 8 && count === 1).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length > 0 ||
                values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 1).length > 0 ||
                values.filter((count, index) => index >= 8 && count === 2).length > 0 &&
                values.filter((count, index) => index < 8 && count === 2).length > 0,
            pair: values[values.length - 1] === 1,
            high_card: true,
        };

        const rank_multiple_joker = {
            royal_flush: false,
            straight_flush: false,
            pents: values.some((count) => count >= 3),
            quads: values.some((count) => count >= 2),
            full_house: values.filter(Boolean).length === 3,
            flush: suits.some((count) => count === NUM_CARDS_IN_HAND_MULTI_JOKER),
            straight: result_straight,
            trips: true,
            two_pairs: values.filter((count, index) => index >= 8 && count > 0).length > 0,
            pair: true,
            high_card: true,
        }

        if (array_joker.length === 1) {
            ranks_joker.straight_flush = ranks_joker.flush && ranks_joker.straight;
            ranks_joker.royal_flush = ranks_joker.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        } else if (array_joker.length === 2) {
            rank_multiple_joker.straight_flush = rank_multiple_joker.flush && rank_multiple_joker.straight;
            rank_multiple_joker.royal_flush = rank_multiple_joker.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        } else {
            ranks.straight_flush = ranks.flush && ranks.straight;
            ranks.royal_flush = ranks.straight_flush && firstCardIndex === TEN_CARD_POSITION;
        }
        let rankIndex = 0;
        let rankDescription = "";

        if (array_joker.length === 1) {
            Object.keys(ranks_joker).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !ranks_joker[key];
            });
        } else if (array_joker.length === 2) {
            Object.keys(rank_multiple_joker).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !rank_multiple_joker[key];
            });
        }
        else {
            Object.keys(ranks).every((key, index) => {
                rankIndex = 10 - index;
                rankDescription = key;
                return !ranks[key];
            });
        }

        console.log(array_joker);
        rankValue +=
            rankIndex * RANK_BASE_VALUE -
            ((rankValue === STRAIGHT_LOW_ACE_INDICATOR && ACE_VALUE - 1) || 0);
        rankDescription = rankDescription
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        return {
            hand,
            suits,
            values,
            rankValue,
            ranks: array_joker.length === 2 ? rank_multiple_joker : array_joker.length === 1 ? ranks_joker : ranks,
            rankDescription,
            display: handDisplay(hand),
        };
    };

    console.log(rankHand());
    res.json({
        data: 'you hit rest endpoint great!'
    });
});

// port
httpserver.listen(process.env.PORT, function () {
    console.log(`server is ready at http://localhost:${process.env.PORT}`);
    console.log(`graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
    console.log(`subscription is ready at http://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`);
});
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.Start;
handle["/Start"] = requestHandlers.Start;
handle["/Tickets"] = requestHandlers.Tickets;
handle["/Status"] = requestHandlers.Status;
handle["/Status2014"] = requestHandlers.Status2014;
handle["/Status2015"] = requestHandlers.Status2015;
handle["/Type"] = requestHandlers.Type;
handle["/Type2014"] = requestHandlers.Type2014;
handle["/Type2015"] = requestHandlers.Type2015;
handle["/Compare"] = requestHandlers.Compare;
handle["/Compare2014"] = requestHandlers.Compare2014;
handle["/Compare2015"] = requestHandlers.Compare2015;
handle["/Priority"] = requestHandlers.Priority;
handle["/Priority2014"] = requestHandlers.Priority2014;
handle["/Priority2015"] = requestHandlers.Priority2015;
handle["/Metrics"] = requestHandlers.Metrics;
handle["/Metrics2014"] = requestHandlers.Metrics2014;
handle["/Metrics2015"] = requestHandlers.Metrics2015;
handle["/WeekOpen"] = requestHandlers.WeekOpen;
handle["/WeekClose"] = requestHandlers.WeekClose;
handle["/CustAll"] = requestHandlers.CustAll;
handle["/CustWeek"] = requestHandlers.CustWeek;
handle["/CustJan"] = requestHandlers.CustJan;
handle["/CustJan2014"] = requestHandlers.CustJan2014;
handle["/CustFeb2014"] = requestHandlers.CustFeb2014;
handle["/CustMar2014"] = requestHandlers.CustMar2014;
handle["/CustApr2014"] = requestHandlers.CustApr2014;
handle["/CustMay2014"] = requestHandlers.CustMay2014;
handle["/CustJune2014"] = requestHandlers.CustJune2014;
handle["/CustJuly2014"] = requestHandlers.CustJuly2014;
handle["/CustAug2014"] = requestHandlers.CustAug2014;
handle["/CustSep2014"] = requestHandlers.CustSep2014;
handle["/CustOct2014"] = requestHandlers.CustOct2014;
handle["/CustNov2014"] = requestHandlers.CustNov2014;
handle["/CustDec2014"] = requestHandlers.CustDec2014;
handle["/CustJan2015"] = requestHandlers.CustJan2015;
handle["/CustFeb2015"] = requestHandlers.CustFeb2015;
handle["/CustMar2015"] = requestHandlers.CustMar2015;
handle["/CustApr2015"] = requestHandlers.CustApr2015;
handle["/CustMay2015"] = requestHandlers.CustMay2015;
handle["/CustJune2015"] = requestHandlers.CustJune2015;
handle["/CustJuly2015"] = requestHandlers.CustJuly2015;
handle["/CustAug2015"] = requestHandlers.CustAug2015;
handle["/CustSep2015"] = requestHandlers.CustSep2015;
handle["/CustOct2015"] = requestHandlers.CustOct2015;
handle["/CustNov2015"] = requestHandlers.CustNov2015;
handle["/CustDec2015"] = requestHandlers.CustDec2015;
handle["/CustFeb"] = requestHandlers.CustFeb;
handle["/CustMar"] = requestHandlers.CustMar;
handle["/CustApr"] = requestHandlers.CustApr;
handle["/CustMay"] = requestHandlers.CustMay;
handle["/CustJune"] = requestHandlers.CustJune;
handle["/CustJuly"] = requestHandlers.CustJuly;
handle["/CustAug"] = requestHandlers.CustAug;
handle["/CustSep"] = requestHandlers.CustSep;
handle["/CustOct"] = requestHandlers.CustOct;
handle["/CustNov"] = requestHandlers.CustNov;
handle["/CustDec"] = requestHandlers.CustDec;
handle["/CatAll"] = requestHandlers.CatAll;
handle["/CatWeek"] = requestHandlers.CatWeek;
handle["/CatJan"] = requestHandlers.CatJan;
handle["/CatJan2014"] = requestHandlers.CatJan2014;
handle["/CatFeb2014"] = requestHandlers.CatFeb2014;
handle["/CatMar2014"] = requestHandlers.CatMar2014;
handle["/CatApr2014"] = requestHandlers.CatApr2014;
handle["/CatMay2014"] = requestHandlers.CatMay2014;
handle["/CatJune2014"] = requestHandlers.CatJune2014;
handle["/CatJuly2014"] = requestHandlers.CatJuly2014;
handle["/CatAug2014"] = requestHandlers.CatAug2014;
handle["/CatSep2014"] = requestHandlers.CatSep2014;
handle["/CatOct2014"] = requestHandlers.CatOct2014;
handle["/CatNov2014"] = requestHandlers.CatNov2014;
handle["/CatDec2014"] = requestHandlers.CatDec2014;
handle["/CatJan2015"] = requestHandlers.CatJan2015;
handle["/CatFeb2015"] = requestHandlers.CatFeb2015;
handle["/CatMar2015"] = requestHandlers.CatMar2015;
handle["/CatApr2015"] = requestHandlers.CatApr2015;
handle["/CatMay2015"] = requestHandlers.CatMay2015;
handle["/CatJune2015"] = requestHandlers.CatJune2015;
handle["/CatJuly2015"] = requestHandlers.CatJuly2015;
handle["/CatAug2015"] = requestHandlers.CatAug2015;
handle["/CatSep2015"] = requestHandlers.CatSep2015;
handle["/CatOct2015"] = requestHandlers.CatOct2015;
handle["/CatNov2015"] = requestHandlers.CatNov2015;
handle["/CatDec2015"] = requestHandlers.CatDec2015;
handle["/CatFeb"] = requestHandlers.CatFeb;
handle["/CatMar"] = requestHandlers.CatMar;
handle["/CatApr"] = requestHandlers.CatApr;
handle["/CatMay"] = requestHandlers.CatMay;
handle["/CatJune"] = requestHandlers.CatJune;
handle["/CatJuly"] = requestHandlers.CatJuly;
handle["/CatAug"] = requestHandlers.CatAug;
handle["/CatSep"] = requestHandlers.CatSep;
handle["/CatOct"] = requestHandlers.CatOct;
handle["/CatNov"] = requestHandlers.CatNov;
handle["/CatDec"] = requestHandlers.CatDec;
handle["/BlAll"] = requestHandlers.BlAll;
handle["/BlWeek"] = requestHandlers.BlWeek;
handle["/BlJan"] = requestHandlers.BlJan;
handle["/BlJan2014"] = requestHandlers.BlJan2014;
handle["/BlFeb2014"] = requestHandlers.BlFeb2014;
handle["/BlMar2014"] = requestHandlers.BlMar2014;
handle["/BlApr2014"] = requestHandlers.BlApr2014;
handle["/BlMay2014"] = requestHandlers.BlMay2014;
handle["/BlJune2014"] = requestHandlers.BlJune2014;
handle["/BlJuly2014"] = requestHandlers.BlJuly2014;
handle["/BlAug2014"] = requestHandlers.BlAug2014;
handle["/BlSep2014"] = requestHandlers.BlSep2014;
handle["/BlOct2014"] = requestHandlers.BlOct2014;
handle["/BlNov2014"] = requestHandlers.BlNov2014;
handle["/BlDec2014"] = requestHandlers.BlDec2014;
handle["/BlJan2015"] = requestHandlers.BlJan2015;
handle["/BlFeb2015"] = requestHandlers.BlFeb2015;
handle["/BlMar2015"] = requestHandlers.BlMar2015;
handle["/BlApr2015"] = requestHandlers.BlApr2015;
handle["/BlMay2015"] = requestHandlers.BlMay2015;
handle["/BlJune2015"] = requestHandlers.BlJune2015;
handle["/BlJuly2015"] = requestHandlers.BlJuly2015;
handle["/BlAug2015"] = requestHandlers.BlAug2015;
handle["/BlSep2015"] = requestHandlers.BlSep2015;
handle["/BlOct2015"] = requestHandlers.BlOct2015;
handle["/BlNov2015"] = requestHandlers.BlNov2015;
handle["/BlDec2015"] = requestHandlers.BlDec2015;
handle["/BlFeb"] = requestHandlers.BlFeb;
handle["/BlMar"] = requestHandlers.BlMar;
handle["/BlApr"] = requestHandlers.BlApr;
handle["/BlMay"] = requestHandlers.BlMay;
handle["/BlJune"] = requestHandlers.BlJune;
handle["/BlJuly"] = requestHandlers.BlJuly;
handle["/BlAug"] = requestHandlers.BlAug;
handle["/BlSep"] = requestHandlers.BlSep;
handle["/BlOct"] = requestHandlers.BlOct;
handle["/BlNov"] = requestHandlers.BlNov;
handle["/BlDec"] = requestHandlers.BlDec;
handle["/BlCat"] = requestHandlers.BlCat;
handle["/BlCatWeek"] = requestHandlers.BlCatWeek;
handle["/BlCatJan"] = requestHandlers.BlCatJan;
handle["/BlCatJan2014"] = requestHandlers.BlCatJan2014;
handle["/BlCatFeb2014"] = requestHandlers.BlCatFeb2014;
handle["/BlCatMar2014"] = requestHandlers.BlCatMar2014;
handle["/BlCatApr2014"] = requestHandlers.BlCatApr2014;
handle["/BlCatMay2014"] = requestHandlers.BlCatMay2014;
handle["/BlCatJune2014"] = requestHandlers.BlCatJune2014;
handle["/BlCatJuly2014"] = requestHandlers.BlCatJuly2014;
handle["/BlCatAug2014"] = requestHandlers.BlCatAug2014;
handle["/BlCatSep2014"] = requestHandlers.BlCatSep2014;
handle["/BlCatOct2014"] = requestHandlers.BlCatOct2014;
handle["/BlCatNov2014"] = requestHandlers.BlCatNov2014;
handle["/BlCatDec2014"] = requestHandlers.BlCatDec2014;
handle["/BlCatJan2015"] = requestHandlers.BlCatJan2015;
handle["/BlCatFeb2015"] = requestHandlers.BlCatFeb2015;
handle["/BlCatMar2015"] = requestHandlers.BlCatMar2015;
handle["/BlCatApr2015"] = requestHandlers.BlCatApr2015;
handle["/BlCatMay2015"] = requestHandlers.BlCatMay2015;
handle["/BlCatJune2015"] = requestHandlers.BlCatJune2015;
handle["/BlCatJuly2015"] = requestHandlers.BlCatJuly2015;
handle["/BlCatAug2015"] = requestHandlers.BlCatAug2015;
handle["/BlCatSep2015"] = requestHandlers.BlCatSep2015;
handle["/BlCatOct2015"] = requestHandlers.BlCatOct2015;
handle["/BlCatNov2015"] = requestHandlers.BlCatNov2015;
handle["/BlCatDec2015"] = requestHandlers.BlCatDec2015;
handle["/BlCatFeb"] = requestHandlers.BlCatFeb;
handle["/BlCatMarch"] = requestHandlers.BlCatMarch;
handle["/BlCatApril"] = requestHandlers.BlCatApril;
handle["/BlCatMay"] = requestHandlers.BlCatMay;
handle["/BlCatJune"] = requestHandlers.BlCatJune;
handle["/BlCatJuly"] = requestHandlers.BlCatJuly;
handle["/BlCatAug"] = requestHandlers.BlCatAug;
handle["/BlCatSep"] = requestHandlers.BlCatSep;
handle["/BlCatOct"] = requestHandlers.BlCatOct;
handle["/BlCatNov"] = requestHandlers.BlCatNov;
handle["/BlCatDec"] = requestHandlers.BlCatDec;
handle["/ticketDetails"] = requestHandlers.ticketDetails;
handle["/ForumList"] = requestHandlers.ForumList;
handle["/ForumDetail"] = requestHandlers.ForumDetail;
handle["/TicketsTest"] = requestHandlers.TicketsTest;


server.start(router.route, handle);

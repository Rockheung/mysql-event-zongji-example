// Client code
const ZongJi = require("zongji");
const { Parser } = require("node-sql-parser");

const { HOSTNAME: host, USERNAME: user, PASSWORD: password } = process.env;

const zongji = new ZongJi({
  host,
  user,
  password
  // debug: true
});
console.log("Connected to", host);
zongji.on("ready", function() {});

zongji.on("binlog", function(evt) {
  const eventName = evt.getEventName();
  try {
    // evt.dump();
    if (eventName === "query" && evt.query.length) {
      const parser = new Parser();
      console.log("\nQUERY >>", evt.query);
      // const { tableList, columnList, ast } = parser.parse(evt.query.trim());
      // console.log(ast);
    } else if (eventName === "writerows") {
      // console.log("\nWRITE >>", { ...evt, _zongji: undefined });
    } else if (eventName === "updaterows") {
      // console.log("\nUPDATE >>", { ...evt, _zongji: undefined });
    } else if (eventName === "xid") {
      console.log("\nQUERY_END >>", { ...evt, _zongji: undefined });
    }
  } catch (e) {
    if (e.name === "SyntaxError") {
      console.error(e.message);
      return;
    }
    console.log(e);
  }
});

zongji.start({
  startAtEnd: true,
  includeEvents: [
    "query",
    "tablemap",
    "writerows",
    "updaterows",
    // "deleterows",
    "xid"
  ]
  // includeSchema: {
  //   chabot: ["cm_regist_info", "cm_info", "member_info"]
  // }
});

process.on("SIGINT", function() {
  // console.log("Got SIGINT.");
  zongji.stop();
  process.exit();
});

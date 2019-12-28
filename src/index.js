// Client code
const ZongJi = require("zongji");
const { Parser } = require("node-sql-parser");

const { HOSTNAME: host, USERNAME: user, PASSWORD: password } = process.env;

const zongji = new ZongJi({
  host,
  user,
  password,
  debug: true
});

zongji.on("binlog", function(evt) {
  try {
    if (evt.getEventName() === "query" && evt.query.length) {
      const parser = new Parser();
      console.log(evt.query);
      const { tableList, columnList, ast } = parser.parse(evt.query);
      console.log(ast);
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error(e);
      return;
    }
    console.log(e);
  }
});

zongji.start({
  includeEvents: [
    "tablemap",
    "writerows",
    "updaterows",
    "deleterows",
    "query",
    "xid"
  ]
});

process.on("SIGINT", function() {
  // console.log("Got SIGINT.");
  zongji.stop();
  process.exit();
});

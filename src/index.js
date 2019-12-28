// Client code
const ZongJi = require("zongji");

const { HOSTNAME: host, USERNAME: user, PASSWORD: password } = process.env;

const zongji = new ZongJi({
  host,
  user,
  password,
  debug: true
});

zongji.on("binlog", function(evt) {
  evt.dump();
});

zongji.start({
  includeEvents: ["tablemap", "writerows", "updaterows", "deleterows"]
});

process.on("SIGINT", function() {
  console.log("Got SIGINT.");
  zongji.stop();
  process.exit();
});

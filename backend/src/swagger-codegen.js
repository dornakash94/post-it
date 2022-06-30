const { generateApi } = require("swagger-typescript-api");
const args = require("minimist")(process.argv.slice(2));
const path = require("path");
const fs = require("fs").promises;

const output = path.resolve(process.cwd(), "./" + args.output);
const name = args.name + ".ts";

generateApi({
  name,
  input: path.resolve(process.cwd(), "./" + args.input),
  output,
  cleanOutput: true,
  extractRequestParams: true,
  extractRequestBody: true,
  generateClient: false,
  generateRouteTypes: true,
}).then(() => {
  const file = output + "/" + name;

  fs.readFile(file, "utf8")
    .then((data) => data.replace(/= never;/g, "= {};"))
    .then((data) => fs.writeFile(file, data, "utf8"));
});

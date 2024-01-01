import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "1234567890",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited() {
  //async will tell JavaScript that it will always return a promise.
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code); //adding teach rows and push to 'countries' array.
  });
  return countries; //return the promise to GET
}
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

//Solution 4
// app.post("/add", async (req, res) => {
//     const input = req.body["country"]; //same syntax and function as 'req.body.country'

//     try {
//       const result = await db.query(
//         "SELECT country_code FROM countries WHERE LOWER (country_name) LIKE '%' || $1 || '%';",
//         [input.toLowerCase()] //this method use the input inserted to find the country code from database. $1 indicating to the 'input'. if more data is inserted $2 will be filled in afterward.
//         //LOWER added to transform input into lowercase,
//         //LIKE to make find related or almost the same word to the answer. User dont need to be exact and detailed.
//         //.toLowerCase to transform to lowercase to match the data taken from the database
//       );

//       const data = result.rows[0];
//       const countryCode = data.country_code; //extracting and assigning data from an array to a variable

//       try {
//         await db.query(
//           "INSERT INTO visited_countries (country_code) VALUES ($1)",
//           [countryCode]
//           //to add the "country_code' to the 'visited_countries' table to be stored
//         );
//         res.redirect("/");
//       } catch (err) {
//         console.log(err);
//         const countries = await checkVisited();
//         res.render("index.js", {
//           countries: countries,
//           total: countries.length,
//           error: "Country has already been added, try again.",
//           //error was passed through ejs to input placeholder if country has been added.
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       const countries = await checkVisited();
//       res.render("index.js", {
//         countries: countries,
//         total: countries.length,
//         err: "Country name does not exist, try again.",
//         //error to be passed through ejs to input placeholder if country does not exist.
//       });
//     }
//   });

//Solution 3
// app.post("/add", async (req, res) => {
//     const input = req.body["country"]; //same syntax and function as 'req.body.country'

//     try {
//       const result = await db.query(
//         "SELECT country_code FROM countries WHERE country_name = $1",
//         [input] //this method use the input inserted to find the country code from database. $1 indicating to the 'input'. if more data is inserted $2 will be filled in afterward.
//       );

//       const data = result.rows[0];
//       const countryCode = data.country_code; //extracting and assigning data from an array to a variable

//       try {
//         await db.query(
//           "INSERT INTO visited_countries (country_code) VALUES ($1)",
//           [countryCode]
//           //to add the "country_code' to the 'visited_countries' table to be stored
//         );
//         res.redirect("/");
//       } catch (err) {
//         console.log(err);
//         const countries = await checkVisited();
//         res.render("index.js", {
//           countries: countries,
//           total: countries.length,
//           error: "Country has already been added, try again.",
//           //error was passed through ejs to input placeholder if country has been added.
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       const countries = await checkVisited();
//       res.render("index.js", {
//         countries: countries,
//         total: countries.length,
//         err: "Country name does not exist, try again.",
//         //error to be passed through ejs to input placeholder if country does not exist.
//       });
//     }
//   });

//Solution 2
// async function checkVisited() {
//   //async will tell JavaScript that it will always return a promise.
//   const result = await db.query("SELECT country_code FROM visited_countries");

//   let countries = [];
//   result.rows.forEach((country) => {
//     countries.push(country.country_code); //adding teach rows and push to 'countries' array.
//   });
//   return countries; //return the promise to GET
// }
// app.get("/", async (req, res) => {
//   const countries = await checkVisited();
//   res.render("index.ejs", { countries: countries, total: countries.length });
// });

// app.post("/add", async (req, res) => {
//   const input = req.body["country"]; //same syntax and function as 'req.body.country'

//   const result = await db.query(
//     "SELECT country_code FROM countries WHERE country_name = $1",
//     [input] //this method use the input inserted to find the country code from database. $1 indicating to the 'input'. if more data is extracted $2 will be filled in after
//   );

//   if (result.rows.length !== 0) {
//     console.log(result.rows[0], "Line 43");
//     const data = result.rows[0];
//     const countryCode = data.country_code; //extracting and assigning data from an array to a variable

//     await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
//       countryCode,
//     ]);
//     res.redirect("/");
//   }
// });

//Solution 1
// app.get("/", async (req, res) => {
//   //Write your code here.
//   const result = await db.query("SELECT country_code FROM visited_countries"); //calling the data from pgAdmin country_code table
//   let countries = []; //declare a void array to store added data
//   result.rows.forEach((country) => {
//     countries.push(country.country_code); //for each row of the result(country_code), each are extracted and added to the countries array.
//   });
//   console.log(result.rows, countries);
//   res.render("index.ejs", { countries: countries, total: countries.length }); //render data to the ejs
//   db.end(); //ending the connection to the database to prevent potential leak connection
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

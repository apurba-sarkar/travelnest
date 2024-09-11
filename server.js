const fs = require("fs");
const express = require("express");
const app = express();

const travels = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`, "utf-8")
);

app.get("/api/v1/travels/:id", (req, res) => {
  //   res.status(200).json({ status: "success", results: travels.length, travels });
  const id = req.params.id * 1;
  if(travels.length-1<id){
    return res.status(404).json({
      msg:"not found"
    })
  }
  console.log(id)
  const newList = travels.find((el) => el.id === id);
  // console.log(req.params)
  res.json({
    newList,
  });

  console.log(newList);
});

app.get("/api/v1/travels", (req, res) => {
    res.status(200).json({ status: "success", results: travels.length, travels });
  // const id = req.params.id * 1;
  // console.log(id)
  // const newList = travels.find((el) => el.id > req.params);
  // res.json({
  //   newList,
  // });


  // console.log(newList);
});

// app.post("/api/v1/travels", (req, res) => {
//   const newId = travels[travels.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   fs.writeFile(`${__dirname}/dev-data/tours-simple.json`, travels, (err) => {
//     JSON.stringify(travels),
//       (err) => {
//         res.status(201).json({
//           status: "ok",
//           data: {
//             travels: newTour,
//           },
//         });
//       };
//   });

//   travels.push(newTour);
//   res.status(200).json({ status: "success", results: travels.length, newTour });
// });

const port = 3000;
app.listen(port, () => {
  console.log("The app is running on port", port);
});

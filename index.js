const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser"); 

dotenv.config();

const ProjectDB = require("./models/projects"); 
const SkillDB = require("./models/skills"); 

const app = express();
const port = process.env.PORT || "3306";

app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true })); 

ProjectDB.initializeProjects();
SkillDB.initializeSkills();

// Index
app.get("/", async (req, res) => {
  let projectList = await ProjectDB.getProjects();
  let skillList = await SkillDB.getSkills();
  res.render("index", { projects: projectList, skills: skillList });
});

// Projects Page
app.get("/projects", async (req, res) => {
  let projectList = await ProjectDB.getProjects();
  res.render("projects", { projects: projectList });
});
app.post("/addproject", async (req, res) => {
  const { name, description, tech, year, status, url } = req.body;
  await ProjectDB.addProject(name, description, tech.split(","), parseInt(year), status, url);
  res.redirect("/projects");
});
app.post("/deleteproject", async (req, res) => {
  await ProjectDB.deleteProjectsByName(req.body.name);
  res.redirect("/projects");
});

// Skills Page
app.get("/skills", async (req, res) => {
  let skillList = await SkillDB.getSkills();
  res.render("skills", { skills: skillList });
});
app.post("/addskill", async (req, res) => {
  const { name, level, category } = req.body;
  await SkillDB.addSkill(name, level, category);
  res.redirect("/skills");
});
app.post("/deleteskill", async (req, res) => {
  await SkillDB.deleteSkillsByName(req.body.name);
  res.redirect("/skills");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
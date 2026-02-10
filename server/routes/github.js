const express = require("express");
const router = express.Router();
const axios = require("axios");
const { calculateScore } = require("../utils/scoring");

function generateSummary(score) {
  if (score >= 90) {
    return "This profile reflects strong engineering maturity, impactful projects, and consistent contribution history. The developer demonstrates production-level readiness and stands out as a highly hireable candidate.";
  } 
  if (score >= 70) {
    return "This developer shows solid technical ability and meaningful project work. With slightly more depth in real-world problem solving or system design, the profile could reach top-tier hiring standards.";
  } 
  if (score >= 50) {
    return "This profile shows growing technical skills and project activity. Focusing on building more complete, original applications and improving consistency will significantly boost hiring potential.";
  } 
  if (score >= 30) {
    return "This GitHub profile reflects early-stage development. More structured projects, clearer documentation, and regular contributions are needed to strengthen professional readiness.";
  } 
  return "This profile currently shows minimal project depth or consistency. Building real-world applications and maintaining steady development activity will greatly improve career opportunities.";
}

router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const userResponse = await axios.get(`https://api.github.com/users/${username}`);
    const repoResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
    const eventsResponse = await axios.get(`https://api.github.com/users/${username}/events`);

    const repos = repoResponse.data.map(repo => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      description: repo.description,
      hasReadme: repo.has_wiki
    }));

    const pushEvents = eventsResponse.data.filter(event => event.type === "PushEvent");
    const recentCommits = pushEvents.length;

    const rankedRepos = [...repos].sort((a, b) => {
      let scoreA = a.stars + (a.description ? 5 : 0) + (a.hasReadme ? 5 : 0) + (a.language ? 5 : 0);
      let scoreB = b.stars + (b.description ? 5 : 0) + (b.hasReadme ? 5 : 0) + (b.language ? 5 : 0);
      return scoreB - scoreA;
    });

    const topProjects = rankedRepos.slice(0, 3);

    const scoreData = calculateScore(repos, recentCommits);
    const summary = generateSummary(scoreData.score);

    res.json({
      username: userResponse.data.login,
      name: userResponse.data.name,
      score: scoreData.score,
      summary: summary,
      recentCommits: recentCommits,
      strengths: scoreData.strengths,
      improvements: scoreData.improvements,
      topProjects: topProjects
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

module.exports = router;

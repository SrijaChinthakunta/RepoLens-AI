const express = require("express");
const router = express.Router();
const axios = require("axios");
const { calculateScore } = require("../utils/scoring");

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

    res.json({
      username: userResponse.data.login,
      name: userResponse.data.name,
      publicRepos: userResponse.data.public_repos,
      followers: userResponse.data.followers,
      following: userResponse.data.following,
      recentCommits: recentCommits,
      score: scoreData.score,
      strengths: scoreData.strengths,
      improvements: scoreData.improvements,
      topProjects: topProjects,
      repos: repos
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

module.exports = router;

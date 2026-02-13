const express = require("express");
const router = express.Router();
const axios = require("axios");
const { calculateScore } = require("../utils/scoring");

/* ---------- Helper: Extract username from URL or plain input ---------- */
function extractUsername(input) {
  try {
    if (!input) return "";

    input = decodeURIComponent(input).trim();

    // If user entered only username
    if (!input.includes("github.com")) {
      return input;
    }

    // Parse full URL
    const url = new URL(input);
    const parts = url.pathname.split("/").filter(Boolean);

    return parts[0] || "";
  } catch {
    return "";
  }
}

/* ---------- Summary Generator ---------- */
function generateSummary(score) {
  if (score >= 85)
    return "This profile reflects strong long-term development effort and well-structured projects, showing high professional readiness.";
  if (score >= 70)
    return "This developer demonstrates solid consistency and project quality, with good signs of sustained engineering practice.";
  if (score >= 50)
    return "This profile shows growing technical ability. Improving documentation and maintaining broader consistency will strengthen it further.";
  if (score >= 30)
    return "This GitHub profile reflects early-stage development. More complete projects and sustained activity are recommended.";
  return "This profile currently shows limited project depth or consistency. Building structured projects over time will greatly improve professional readiness.";
}

/* ---------- Route ---------- */
router.get("/:input", async (req, res) => {
  try {
    const rawInput = req.params.input;
    const username = extractUsername(rawInput);

    if (!username) {
      return res.status(400).json({ error: "Invalid GitHub URL or username" });
    }

    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );

    const repos = repoResponse.data.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      description: repo.description,
      hasReadme: repo.has_wiki,
      pushedAt: repo.pushed_at,
      createdAt: repo.created_at,
    }));

    const now = Date.now();
    const sixMonthsMs = 1000 * 60 * 60 * 24 * 30 * 6;

    const activeRepos = repos.filter(
      (r) => now - new Date(r.pushedAt).getTime() < sixMonthsMs
    );

    const rankedRepos = [...repos].sort((a, b) => b.stars - a.stars);
    const topProjects = rankedRepos.slice(0, 3);

    const scoreData = calculateScore(repos);
    const summary = generateSummary(scoreData.score);

    res.json({
      username: userResponse.data.login,
      name: userResponse.data.name,
      avatar: userResponse.data.avatar_url,
      bio: userResponse.data.bio,
      followers: userResponse.data.followers,
      activeRepos: activeRepos.length,
      score: scoreData.score,
      breakdown: scoreData.breakdown,
      summary,
      strengths: scoreData.strengths,
      improvements: scoreData.improvements,
      topProjects,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

module.exports = router;

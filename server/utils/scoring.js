function calculateScore(repos, recentCommits) {
  let score = 0;
  let strengths = [];
  let improvements = [];

  const repoCount = repos.length;
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const languages = new Set(repos.map(r => r.language).filter(Boolean));
  const reposWithReadme = repos.filter(r => r.hasReadme).length;

  const weakProjects = repos.filter(r =>
    !r.description ||
    r.name.toLowerCase().includes("test") ||
    r.name.toLowerCase().includes("demo") ||
    r.name.toLowerCase().includes("hello")
  );

  // Repo Count
  if (repoCount >= 5) {
    score += 15;
    strengths.push("Strong number of public repositories");
  } else {
    improvements.push("Build more public projects to showcase experience");
  }

  // Popularity
  if (totalStars > 50) {
    score += 15;
    strengths.push("Projects show community interest");
  } else {
    improvements.push("Create projects that solve real-world problems");
  }

  // Tech Diversity
  if (languages.size >= 3) {
    score += 15;
    strengths.push("Good variety of technologies used");
  } else {
    improvements.push("Explore more tools, frameworks, or languages");
  }

  // Documentation
  if (reposWithReadme >= repoCount / 2) {
    score += 15;
    strengths.push("Projects include helpful documentation");
  } else {
    improvements.push("Add README files explaining your projects");
  }

  // Project Quality
  if (weakProjects.length < repoCount / 2) {
    score += 15;
    strengths.push("Projects appear meaningful and well-defined");
  } else {
    improvements.push("Avoid tutorial/demo repos; build original applications");
  }

  // Activity
  if (recentCommits > 5) {
    score += 15;
    strengths.push("Shows consistent recent coding activity");
  } else {
    improvements.push("Increase commit activity to show consistency");
  }

  // Bonus for high impact
  if (totalStars > 500) {
    score += 10;
    strengths.push("Some projects have significant impact");
  }

  return { score: Math.min(score, 100), strengths, improvements };
}

module.exports = { calculateScore };

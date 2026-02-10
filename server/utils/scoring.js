function calculateScore(repos) {
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

  if (repoCount >= 5) {
    score += 10;
    strengths.push("Good number of public repositories");
  } else {
    improvements.push("Create more quality public projects");
  }

  if (totalStars > 50) {
    score += 10;
    strengths.push("Projects show community interest (stars)");
  } else {
    improvements.push("Try building projects others would find useful");
  }

  if (languages.size >= 3) {
    score += 10;
    strengths.push("Good variety of technologies used");
  } else {
    improvements.push("Explore more programming languages or tech stacks");
  }

  if (reposWithReadme >= repoCount / 2) {
    score += 10;
    strengths.push("Many projects include documentation");
  } else {
    improvements.push("Add README files to explain your projects");
  }

  if (weakProjects.length < repoCount / 2) {
    score += 10;
    strengths.push("Several projects appear meaningful and well-defined");
  } else {
    improvements.push("Avoid tutorial/demo projects and build real-world applications");
  }

  score = Math.min(score, 50);

  return { score, strengths, improvements };
}

module.exports = { calculateScore };

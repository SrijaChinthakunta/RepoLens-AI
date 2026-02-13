function calculateScore(repos) {
  let score = 0;
  let strengths = [];
  let improvements = [];

  const now = Date.now();
  const sixMonthsMs = 1000 * 60 * 60 * 24 * 30 * 6;

  const repoCount = repos.length || 1;

  const reposWithDesc = repos.filter(
    (r) => r.description && r.description.length > 15
  );
  const reposWithReadme = repos.filter((r) => r.hasReadme);
  const reposWithLang = repos.filter((r) => r.language);

  let breakdown = {
    projects: 0,
    descriptions: 0,
    documentation: 0,
    code: 0,
    consistency: 0,
    community: 0,
  };

  // 📁 Projects (15)
  if (repos.length >= 8) {
    score += 15;
    breakdown.projects = 15;
    strengths.push("Maintains a strong set of public repositories");
  } else {
    improvements.push("Increase the number of well-developed public projects");
  }

  // 📝 Descriptions (15)
  if (reposWithDesc.length >= repoCount * 0.6) {
    score += 15;
    breakdown.descriptions = 15;
    strengths.push("Most projects include meaningful descriptions");
  } else {
    improvements.push("Add clear descriptions explaining each project's purpose");
  }

  // 📘 Documentation (15)
  if (reposWithReadme.length >= repoCount * 0.5) {
    score += 15;
    breakdown.documentation = 15;
    strengths.push("Projects show good documentation practices");
  } else {
    improvements.push("Add README files with setup and usage instructions");
  }

  // 💻 Code Presence (20)
  if (reposWithLang.length >= repoCount * 0.7) {
    score += 20;
    breakdown.code = 20;
    strengths.push("Repositories contain substantial code content");
  } else {
    improvements.push("Ensure repositories contain meaningful code, not just placeholders");
  }

  // 🔁 Consistency
  const recentRepos = repos.filter(
    (r) => now - new Date(r.pushedAt).getTime() < sixMonthsMs
  );

  let consistencyScore = 0;

  if (recentRepos.length >= 4) consistencyScore += 10;
  else if (recentRepos.length >= 2) consistencyScore += 6;
  else if (recentRepos.length === 1) consistencyScore += 2;
  else improvements.push("Try maintaining activity across multiple projects over time");

  const longTermRepos = repos.filter((r) => {
    const created = new Date(r.createdAt).getTime();
    const lastPush = new Date(r.pushedAt).getTime();
    return lastPush - created > sixMonthsMs;
  });

  if (longTermRepos.length >= 3) consistencyScore += 10;
  else if (longTermRepos.length >= 1) consistencyScore += 5;

  const monthsSet = new Set(repos.map((r) => new Date(r.pushedAt).getMonth()));

  if (monthsSet.size >= 4) consistencyScore += 5;
  else if (monthsSet.size >= 2) consistencyScore += 3;
  else if (monthsSet.size === 1) consistencyScore += 1;

  if (consistencyScore > 0) {
    strengths.push("Shows consistent development effort over time");
  }

  breakdown.consistency = consistencyScore;
  score += consistencyScore;

  // 🌟 Community Bonus (5)
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  if (totalStars > 20) {
    score += 5;
    breakdown.community = 5;
    strengths.push("Some projects received community interest");
  }

  return {
    score: Math.min(score, 100),
    strengths,
    improvements,
    breakdown: [
      breakdown.projects,
      breakdown.descriptions,
      breakdown.documentation,
      breakdown.code,
      breakdown.consistency,
      breakdown.community,
    ],
  };
}

module.exports = { calculateScore };

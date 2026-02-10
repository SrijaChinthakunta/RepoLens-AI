function calculateScore(repos) {
  let score = 0;
  let strengths = [];
  let improvements = [];

  const now = Date.now();
  const sixMonthsMs = 1000 * 60 * 60 * 24 * 30 * 6;

  const repoCount = repos.length;
  const reposWithDesc = repos.filter(r => r.description && r.description.length > 15);
  const reposWithReadme = repos.filter(r => r.hasReadme);
  const reposWithLang = repos.filter(r => r.language);


  // 📁 Project Quantity (15 pts)

  if (repoCount >= 8) {
    score += 15;
    strengths.push("Maintains a strong set of public repositories");
  } else {
    improvements.push("Increase the number of well-developed public projects");
  }


  // 📝 Descriptions (15 pts)
 
  if (reposWithDesc.length >= repoCount * 0.6) {
    score += 15;
    strengths.push("Most projects include meaningful descriptions");
  } else {
    improvements.push("Add clear descriptions explaining each project's purpose");
  }

  
  // 📘 Documentation (15 pts)

  if (reposWithReadme.length >= repoCount * 0.5) {
    score += 15;
    strengths.push("Projects show good documentation practices");
  } else {
    improvements.push("Add README files with setup and usage instructions");
  }


  // 💻 Code Presence (20 pts)

  if (reposWithLang.length >= repoCount * 0.7) {
    score += 20;
    strengths.push("Repositories contain substantial code content");
  } else {
    improvements.push("Ensure repositories contain meaningful code, not just placeholders");
  }

  
  // 🔁 CONSISTENCY SCORING (25 pts)


  // 1️⃣ Multi-repo recent activity (10 pts)
  const recentRepos = repos.filter(r => {
    const lastPush = new Date(r.pushedAt).getTime();
    return now - lastPush < sixMonthsMs;
  });

  if (recentRepos.length >= 4) {
    score += 10;
    strengths.push("Multiple projects show recent development activity");
  } else if (recentRepos.length >= 2) {
    score += 6;
  } else if (recentRepos.length === 1) {
    score += 2;
  } else {
    improvements.push("Try maintaining activity across multiple projects over time");
  }

  // 2️⃣ Project lifespan (10 pts)
  const longTermRepos = repos.filter(r => {
    const created = new Date(r.createdAt).getTime();
    const lastPush = new Date(r.pushedAt).getTime();
    return (lastPush - created) > sixMonthsMs;
  });

  if (longTermRepos.length >= 3) {
    score += 10;
    strengths.push("Several projects show long-term development effort");
  } else if (longTermRepos.length >= 1) {
    score += 5;
  }

  // 3️⃣ Activity distribution across months (5 pts)
  const monthsSet = new Set(
    repos.map(r => new Date(r.pushedAt).getMonth())
  );

  if (monthsSet.size >= 4) {
    score += 5;
    strengths.push("Activity is distributed across multiple time periods");
  } else if (monthsSet.size >= 2) {
    score += 3;
  } else if (monthsSet.size === 1) {
    score += 1;
  }

  
  // 🌟 Small community bonus (5 pts)
 
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  if (totalStars > 20) {
    score += 5;
    strengths.push("Some projects received community interest");
  }

  return { score: Math.min(score, 100), strengths, improvements };
}

module.exports = { calculateScore };

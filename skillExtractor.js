import fs from 'fs/promises';

let jobRoles = [];

try {
  const raw = await fs.readFile(new URL('./jobRoles.json', import.meta.url), 'utf-8');
  jobRoles = JSON.parse(raw);
} catch (err) {
  console.error("❌ Failed to load jobRoles.json:", err);
}

// Function to extract skills using word-matching logic
export default function extractSkills(resumeText) {
  const resumeWords = resumeText.toLowerCase().split(/[\s,.;:\n()]+/);

  const matched = [];

  for (const job of jobRoles) {
    const matchedSkills = job.skills.filter(skill =>
      resumeWords.includes(skill.toLowerCase())
    );

    if (matchedSkills.length > 0) {
      matched.push({
        role: job.role,
        matchedSkills
      });
    }
  }

  return matched;
}
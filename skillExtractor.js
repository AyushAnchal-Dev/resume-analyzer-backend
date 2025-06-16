import nlp from 'compromise';
import fs from 'fs/promises';

let jobRoles = [];

try {
  const raw = await fs.readFile(new URL('./jobRoles.json', import.meta.url), 'utf-8');
  jobRoles = JSON.parse(raw);
} catch (err) {
  console.error("❌ Failed to load jobRoles.json:", err);
}

// Function to extract skills from resume text
export default function extractSkills(resumeText) {
  const doc = nlp(resumeText);
  const nouns = doc.nouns().out('array');

  const matched = [];

  for (const job of jobRoles) {
    const match = job.skills.filter(skill =>
      nouns.map(n => n.toLowerCase()).includes(skill.toLowerCase())
    );
    if (match.length > 0) {
      matched.push({ role: job.role, matchedSkills: match });
    }
  }

  return matched;
}
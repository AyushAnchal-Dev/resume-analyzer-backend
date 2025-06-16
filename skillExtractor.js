import nlp from 'compromise';
import jobRoles from './jobRoles.json' assert { type: "json" };

// Function to extract skills from resume text
export default function extractSkills(resumeText) {
  const doc = nlp(resumeText);
  const nouns = doc.nouns().out('array'); // Extract all nouns from resume

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
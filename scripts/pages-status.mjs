// Read hosting configuration with the job's existing Pages permission.
const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
if (!repository || !token) throw new Error('Run this diagnostic inside GitHub Actions.');
const response = await fetch(`${process.env.GITHUB_API_URL || 'https://api.github.com'}/repos/${repository}/pages`, {
  headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2026-03-10' }
});
if (!response.ok) throw new Error(`Cannot read Pages configuration (${response.status}).`);
const pages = await response.json();
console.log(`Pages publishing mode: ${pages.build_type}`);
console.log(`Pages website: ${pages.html_url}`);
if (pages.build_type !== 'workflow') console.warn('::warning::Select GitHub Actions under Settings > Pages > Build and deployment > Source. Branch builds can replace this website with repository documentation.');

/**
 * GitHub API Client for direct two-way synchronization:
 * Commits updated portfolio data (certificates, internships, education, projects)
 * directly into the user's GitHub repository.
 */

export interface GitHubPushResult {
  success: boolean;
  commitUrl?: string;
  message?: string;
  error?: string;
}

export interface RepoInfo {
  defaultBranch: string;
  fullName: string;
  htmlUrl: string;
}

function utf8ToBase64(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch {
    // Fallback for environments with Buffer
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
    return btoa(str);
  }
}

/**
 * Validates a GitHub Personal Access Token and retrieves repository info
 */
export async function verifyGitHubAccess(
  token: string,
  owner: string = 'abhishekCode7266',
  repo: string = 'Abhishek_portfolio'
): Promise<{ valid: boolean; repoInfo?: RepoInfo; error?: string }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Studio-Sync-Agent',
      },
    });

    if (res.status === 401) {
      return { valid: false, error: 'Invalid or expired GitHub token. Please check your Personal Access Token.' };
    }
    if (res.status === 404) {
      return { valid: false, error: `Repository "${owner}/${repo}" was not found. Please verify the repository name.` };
    }
    if (!res.ok) {
      return { valid: false, error: `GitHub API error (status ${res.status}).` };
    }

    const data = await res.json();
    return {
      valid: true,
      repoInfo: {
        defaultBranch: data.default_branch || 'main',
        fullName: data.full_name,
        htmlUrl: data.html_url,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network failure';
    return { valid: false, error: `Could not connect to GitHub: ${message}` };
  }
}

/**
 * Pushes updated portfolio data directly to the GitHub repository contents.
 * Automatically updates public/portfolio-data.json so GitHub Pages deploys the live changes.
 */
export async function pushDataToGitHubRepo(
  token: string,
  portfolioData: object,
  owner: string = 'abhishekCode7266',
  repo: string = 'Abhishek_portfolio',
  commitMessage: string = 'Update portfolio data (Certificates, Education, Internships, Projects) via Portfolio Studio'
): Promise<GitHubPushResult> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    return { success: false, error: 'GitHub Personal Access Token is required.' };
  }

  try {
    // 1. Check repository and detect default branch
    const check = await verifyGitHubAccess(cleanToken, owner, repo);
    if (!check.valid || !check.repoInfo) {
      return { success: false, error: check.error || 'Failed to authenticate with GitHub.' };
    }

    const branch = check.repoInfo.defaultBranch;
    const jsonString = JSON.stringify(portfolioData, null, 2);
    const base64Content = utf8ToBase64(jsonString);

    // List of candidate file paths to keep synchronized in the repository
    const targetPaths = ['public/portfolio-data.json', 'portfolio-data.json'];
    let primaryCommitUrl: string | undefined;

    for (const filePath of targetPaths) {
      // 2. Check if file already exists in repository to obtain its SHA
      let existingSha: string | undefined;
      try {
        const fileRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&_t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'Portfolio-Studio-Sync-Agent',
            },
            cache: 'no-store',
          }
        );

        if (fileRes.ok) {
          const fileData = await fileRes.json();
          existingSha = fileData.sha;
        } else if (fileRes.status === 404 && filePath !== 'public/portfolio-data.json') {
          // If secondary path does not exist, skip it
          continue;
        }
      } catch {
        // Continue to attempt creation
      }

      // 3. Commit new content to the repository
      const putBody: {
        message: string;
        content: string;
        branch: string;
        sha?: string;
      } = {
        message: commitMessage,
        content: base64Content,
        branch,
      };

      if (existingSha) {
        putBody.sha = existingSha;
      }

      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Portfolio-Studio-Sync-Agent',
          },
          body: JSON.stringify(putBody),
        }
      );

      if (!commitRes.ok) {
        const errJson = await commitRes.json().catch(() => ({}));
        // If updating secondary file fails, that's okay, but if primary fails return error
        if (filePath === 'public/portfolio-data.json') {
          return {
            success: false,
            error: errJson.message || `Failed to commit to ${filePath} (Status ${commitRes.status})`,
          };
        }
      } else {
        const commitData = await commitRes.json();
        if (commitData.commit?.html_url) {
          primaryCommitUrl = commitData.commit.html_url;
        }
      }
    }

    return {
      success: true,
      commitUrl: primaryCommitUrl || `${check.repoInfo.htmlUrl}/commits/${branch}`,
      message: `Successfully pushed to ${owner}/${repo} on branch ${branch}! GitHub Pages will automatically update with your new certificates, education, and internships.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: `GitHub push failed: ${message}` };
  }
}

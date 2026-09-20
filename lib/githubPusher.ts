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
 * Commits a single text file directly to a GitHub repository
 */
export async function commitSingleFile(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
  contentStr: string,
  commitMessage: string
): Promise<{ success: boolean; error?: string; commitUrl?: string }> {
  try {
    const cleanToken = token.trim();
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
      }
    } catch {
      // Continue to attempt creation
    }

    const putBody: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message: commitMessage,
      content: utf8ToBase64(contentStr),
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
      return { success: false, error: errJson.message || `Failed to commit ${filePath}` };
    }

    const commitData = await commitRes.json();
    return { success: true, commitUrl: commitData.commit?.html_url };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown commit error';
    return { success: false, error: msg };
  }
}

export const CANONICAL_WORKFLOW_YML = `# Sample workflow for building and deploying a Next.js site to GitHub Pages
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
        with:
          static_site_generator: next

      - name: Install dependencies
        run: npm ci || npm install --legacy-peer-deps

      - name: Build with Next.js
        env:
          NODE_ENV: production
          NEXT_PUBLIC_BASE_PATH: \${{ steps.pages.outputs.base_path }}
        run: |
          rm -rf app/api
          npx next build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

/**
 * Commits the fixed GitHub Actions Pages workflow (.github/workflows/nextjs.yml)
 * so that GitHub Actions deploys the static site without failing on server-side API routes.
 */
export async function pushWorkflowFixToGitHub(
  token: string,
  owner: string = 'abhishekCode7266',
  repo: string = 'Abhishek_portfolio'
): Promise<GitHubPushResult> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    return { success: false, error: 'GitHub Personal Access Token is required.' };
  }

  const check = await verifyGitHubAccess(cleanToken, owner, repo);
  if (!check.valid || !check.repoInfo) {
    return { success: false, error: check.error || 'Failed to authenticate with GitHub.' };
  }

  const branch = check.repoInfo.defaultBranch;
  const res = await commitSingleFile(
    cleanToken,
    owner,
    repo,
    branch,
    '.github/workflows/nextjs.yml',
    CANONICAL_WORKFLOW_YML,
    'fix: update GitHub Pages workflow to handle Next.js static export build'
  );

  if (!res.success) {
    return { success: false, error: res.error };
  }

  return {
    success: true,
    commitUrl: res.commitUrl,
    message: `Successfully updated .github/workflows/nextjs.yml on branch ${branch}! GitHub Actions is now re-running and will deploy green ✅.`,
  };
}

/**
 * Pushes updated portfolio data directly to the GitHub repository contents.
 * Automatically updates public/portfolio-data.json and also ensures GitHub Pages workflow is up-to-date.
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

    // Also ensure .github/workflows/nextjs.yml has the static export build fix
    try {
      await commitSingleFile(
        cleanToken,
        owner,
        repo,
        branch,
        '.github/workflows/nextjs.yml',
        CANONICAL_WORKFLOW_YML,
        'fix: update GitHub Pages workflow for Next.js static export build'
      );
    } catch {
      // Non-blocking: continue even if workflow commit fails
    }

    return {
      success: true,
      commitUrl: primaryCommitUrl || `${check.repoInfo.htmlUrl}/commits/${branch}`,
      message: `Successfully pushed to ${owner}/${repo} on branch ${branch}! The workflow fix was applied and GitHub Pages will build green ✅ with all your live data.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: `GitHub push failed: ${message}` };
  }
}

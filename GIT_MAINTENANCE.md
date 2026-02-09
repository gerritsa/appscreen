# Git Maintenance Cheat Sheet

This guide explains how to keep your fork of `AppScreen` up to date with the
original repository (`upstream`).

## Your Setup

- **`origin`**: Your GitHub fork (`github.com/gerritsa/appscreen`)
- **`upstream`**: The original repository (`github.com/YUZU-Hub/appscreen`)

---

## 1. Syncing with Upstream

To bring in the latest changes from the original repository:

1. **Fetch current updates**:
   ```bash
   git fetch upstream
   ```

2. **Merge changes into your local main branch**:
   ```bash
   git checkout main
   git merge upstream/main
   ```

3. **Push the updates to your GitHub fork**:
   ```bash
   git push origin main
   ```

---

## 2. Recommendation: Rebasing

Instead of merging, you can "replay" your changes on top of the latest upstream
code. This keeps your history linear and clean:

```bash
git pull --rebase upstream main
```

---

## 3. Handling Conflicts

If you and the upstream team edited the same lines:

1. Git will pause and tell you which files have conflicts.
2. Open the file; look for `<<<<<<<`, `=======`, and `>>>>>>>`.
3. Choose the code you want to keep.
4. Save and run:
   ```bash
   git add <filename>
   git commit -m "Resolved merge conflict from upstream"
   ```

---

## 4. Quick Checks

- **Check your remotes**: `git remote -v`
- **Check status**: `git status`
- **Check commit history**: `git log --oneline -n 10`

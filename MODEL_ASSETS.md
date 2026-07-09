# Model Assets Guide

This document defines how model-related assets are managed in this repository so collaboration stays reproducible, lightweight, and professional.

## Purpose

The project includes multiple healthcare ML workflows. Some files are essential for reproducibility in Git, while others are heavy generated artifacts that should remain local or be shared via external storage.

## Policy Summary

Tracked in Git:
- Notebooks (.ipynb)
- Feature metadata (feature_list*.json, metadata*.json, class_indices.json)
- Small, human-reviewable datasets used for development (.csv where appropriate)
- Source code and documentation

Local-only (not pushed to GitHub):
- Trained binary model artifacts (.h5, .pkl, .model)
- Local archives (.zip, .rar, .7z, .tar.gz)
- Temporary experiment outputs (for example checkpoints/, runs/)

Reason:
- Keeps repository size manageable
- Improves clone/pull speed
- Keeps version control focused on reproducible logic and metadata
- Avoids accidental leakage of large or sensitive files

## Current Ignore Rules (Model-Related)

The root ignore policy excludes:
- Models/**/*.h5
- Models/**/*.pkl
- Models/**/*.model
- Models/**/checkpoints/
- Models/**/runs/
- Archive formats such as *.zip

## Model Directory Intent

Each model folder under Models/ should ideally contain:
- Training or experimentation notebook
- Feature definition and metadata JSON
- Optional dataset references or small sample data for reproducibility

Heavy outputs from training should stay local and be regenerated when needed.

## Reproducibility Workflow

1. Clone repository and create a Python environment.
2. Open model notebook from the relevant folder in Models/.
3. Install notebook dependencies.
4. Train or load the model pipeline as defined in notebook.
5. Keep generated binary artifacts local (do not commit).
6. Commit only notebook logic or metadata improvements.

## Sharing Large Model Artifacts

For team distribution of trained binaries, use one of:
- GitHub Releases assets
- Cloud object storage (for example Google Drive, S3, GCS)
- Institution-managed artifact storage

If external artifacts are published, add:
- Download link
- Version/tag
- Checksum (recommended)
- Expected path for local execution

## One-Time Cleanup Command (If Large Files Were Already Tracked)

Use this non-destructive command to stop tracking heavy model artifacts while keeping local files:

git ls-files | Select-String "\.(zip|h5|pkl|model)$" | ForEach-Object { git rm --cached -- "$($_.Line)" }

Then commit the index update:

git commit -m "chore: untrack large model artifacts"

## Collaboration Checklist

Before opening a PR:
- No .env files committed
- No large model binaries committed
- Notebook outputs are clean (where practical)
- Metadata files updated if feature schema changed
- README and this guide updated if workflow changed

## Recommended Future Improvement

Add lightweight model cards per classifier with:
- Problem statement
- Input features
- Training data summary
- Metrics and limitations
- Safe-use notes for healthcare context

---
title: "Principal Component Analysis (PCA)"
description: "Exam guide to Principal Component Analysis, covariance matrix, eigenvectors, eigenvalues, variance retention, and dimensionality reduction step-by-step."
unit: "Unit 3: Dimensionality Reduction"
subject: "Machine Learning"
semester: "Semester 5"
keywords: ["PCA", "dimensionality reduction", "covariance matrix", "eigenvectors", "eigenvalues"]
relatedSlugs: ["linear-regression", "decision-trees"]
---

## 1. Introduction to PCA

**Principal Component Analysis (PCA)** is an unsupervised linear dimensionality reduction technique used to project high-dimensional data onto a lower-dimensional subspace while preserving the maximum variance of the dataset.

### Why Dimensionality Reduction?
- **Curse of Dimensionality**: High-dimensional datasets require exponentially more data and computation to train.
- **Multicollinearity Removal**: Eliminates correlated features.
- **Data Visualization**: Reduces data to 2D or 3D for plotting.

---

## 2. Step-by-Step Mathematical Algorithm

Given an $N \times D$ data matrix $X$ with $N$ samples and $D$ features:

### Step 1: Standardize the Feature Matrix
Subtract the mean vector $\mu$ and divide by standard deviation $\sigma$:

$$Z = \frac{X - \mu}{\sigma}$$

### Step 2: Compute the Covariance Matrix ($\Sigma$)
Calculate the $D \times D$ covariance matrix to measure pairwise feature correlations:

$$\Sigma = \frac{1}{N-1} Z^T Z$$

### Step 3: Compute Eigenvalues ($\lambda$) and Eigenvectors ($v$)
Solve the characteristic equation:

$$\Sigma v = \lambda v$$

- **Eigenvectors ($v$)**: Define the directions of the new principal axes (orthogonal components).
- **Eigenvalues ($\lambda$)**: Quantify the amount of variance explained by each principal axis.

### Step 4: Sort and Select $k$ Top Eigenvectors
Sort eigenvalues in descending order: $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_D$.

Select the top $k$ eigenvectors corresponding to the $k$ largest eigenvalues to construct a projection matrix $W_k$ ($D \times k$).

### Step 5: Project Data onto New Subspace
Transform the $N \times D$ matrix $Z$ into the $N \times k$ reduced matrix $Y$:

$$Y = Z \cdot W_k$$

---

## 3. Explained Variance Ratio

The proportion of total dataset variance captured by the first $k$ principal components is computed as:

$$\text{Explained Variance Ratio} = \frac{\sum_{i=1}^{k} \lambda_i}{\sum_{j=1}^{D} \lambda_j}$$

Typically, $k$ is chosen such that cumulative variance retains **85% to 95%** of the original information.

---

## 4. Key Properties & Limitations of PCA

- **Orthogonality**: All principal components are perpendicular to each other ($v_i \cdot v_j = 0$), eliminating feature redundancy.
- **Linearity Assumption**: PCA only captures linear relationships between features. For non-linear structures, **Kernel PCA** or t-SNE should be used.
- **Scale Sensitivity**: Features must be standardized ($z$-score) prior to running PCA; otherwise, features with large scales will dominate.

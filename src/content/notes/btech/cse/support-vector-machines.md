---
title: "Support Vector Machines (SVM)"
description: "Comprehensive study note on linear and non-linear Support Vector Machines, margin maximization, support vectors, soft-margin C parameter, and the Kernel Trick."
unit: "Unit 2: Supervised Learning"
subject: "Machine Learning"
semester: "Semester 5"
keywords: ["SVM", "support vector machines", "hyperplane", "kernel trick", "RBF kernel"]
relatedSlugs: ["decision-trees", "linear-regression"]
---

## 1. Introduction to Support Vector Machines

**Support Vector Machine (SVM)** is a powerful supervised learning model used for binary classification, multi-class classification, and regression.

The fundamental goal of SVM is to find an **Optimal Decision Boundary (Hyperplane)** in an $n$-dimensional feature space that separates data points of different classes with the **maximum geometric margin**.

---

## 2. Mathematical Formulation

### Hyperplane Equation
A hyperplane separating data points in $n$-dimensional space is defined as:

$$w^T x + b = 0$$

Where:
- $w$: Weight vector normal to the hyperplane.
- $x$: Input feature vector.
- $b$: Bias scalar.

### Functional & Geometric Margin
For a training dataset $(x_i, y_i)$ where $y_i \in \{-1, +1\}$:

- **Functional Margin**: $\gamma_i = y_i (w^T x_i + b)$
- **Geometric Margin**: $M = \frac{2}{\|w\|}$

To maximize the geometric margin $M$, we minimize $\frac{1}{2} \|w\|^2$ subject to:

$$y_i (w^T x_i + b) \ge 1 \quad \forall i$$

---

## 3. Hard Margin vs. Soft Margin SVM

### A. Hard Margin SVM
Assumes data is **strictly linearly separable**. No training point is allowed inside the margin boundaries ($y_i(w^T x_i + b) \ge 1$).

### B. Soft Margin SVM (Slack Variables $\xi_i$)
Real-world data often contains noise and overlap. Soft Margin SVM introduces slack variables $\xi_i \ge 0$ and a regularization parameter $C$:

$$\min_{w, b, \xi} \frac{1}{2} \|w\|^2 + C \sum_{i=1}^{N} \xi_i$$

Subject to:

$$y_i (w^T x_i + b) \ge 1 - \xi_i, \quad \xi_i \ge 0$$

- **Large $C$**: High penalty for misclassification (narrow margin, risk of overfitting).
- **Small $C$**: Allows more misclassifications (wider margin, higher tolerance to noise).

---

## 4. The Kernel Trick

When data is non-linearly separable in 2D or 3D space, SVM transforms the input vectors $x$ into a higher-dimensional feature space $\phi(x)$ where the data becomes linearly separable.

Instead of explicitly computing $\phi(x)$, SVM uses a **Kernel Function $K(x_i, x_j)$** to compute inner products directly:

$$K(x_i, x_j) = \langle \phi(x_i), \phi(x_j) \rangle$$

### Popular Kernel Functions

1. **Linear Kernel**: $K(x_i, x_j) = x_i^T x_j$
2. **Polynomial Kernel**: $K(x_i, x_j) = (x_i^T x_j + c)^d$
3. **Radial Basis Function (RBF / Gaussian)**: 
   $$K(x_i, x_j) = \exp\left( -\gamma \|x_i - x_j\|^2 \right)$$

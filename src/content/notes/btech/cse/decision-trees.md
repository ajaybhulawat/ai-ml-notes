---
title: "Decision Trees in Machine Learning"
description: "Master Decision Trees for university exams: complete 2-mark definitions, 5-mark algorithm summaries, 10-mark entropy & Gini derivations, worked numerical example, and pruning methods."
unit: "Unit 2 – Supervised Learning"
subject: "Machine Learning"
semester: "Semester 5"
keywords: ["decision trees", "gini impurity", "entropy", "information gain", "CART", "pruning", "ID3"]
relatedSlugs: ["linear-regression", "support-vector-machines", "principal-component-analysis"]
---

## 🎯 Quick Exam Revision Summary

> **Core Definition:** A Decision Tree is a non-parametric supervised learning model structured as a flowchart tree. It recursively partitions training data into subsets based on feature values to maximize information purity.

| Metric | Formula | Best Used For | Algorithm |
| :--- | :--- | :--- | :--- |
| **Entropy** | $H(S) = -\sum_{i=1}^{c} p_i \log_2(p_i)$ | Purity measurement | ID3 |
| **Information Gain** | $IG(S, A) = H(S) - \sum \frac{\|S_v\|}{\|S\|} H(S_v)$ | Feature selection | ID3, C4.5 |
| **Gini Impurity** | $Gini(S) = 1 - \sum_{i=1}^{c} p_i^2$ | Binary classification | CART |

---

## ⚡ 2-Mark University Exam Questions & Answers

### Q1: What is a Decision Tree?
**Answer:** A Decision Tree is a hierarchical tree-structured supervised learning algorithm where:
1. **Root & Internal Nodes** represent feature splits.
2. **Branches** represent decision rules.
3. **Leaf Nodes** represent final class labels or continuous target values.

### Q2: What is Information Gain?
**Answer:** Information Gain measures the reduction in entropy (uncertainty) achieved by partitioning a dataset $S$ according to a feature $A$:
$$IG(S, A) = \text{Entropy}(S) - \sum_{v \in Values(A)} \frac{|S_v|}{|S|} \text{Entropy}(S_v)$$
The feature with the **highest Information Gain** is selected for splitting.

### Q3: What is Gini Impurity?
**Answer:** Gini Impurity measures the probability of misclassifying a randomly chosen element if it were randomly labeled according to the distribution of targets in the subset:
$$Gini(S) = 1 - \sum_{i=1}^{c} p_i^2$$
A Gini Impurity of **0.0** represents a pure node (all samples belong to one class).

---

## 📝 5-Mark Short Notes: Building Decision Trees

### Step-by-Step ID3 / CART Construction Algorithm

1. **Calculate Baseline Purity:** Compute baseline Entropy or Gini Impurity for the target variable in dataset $S$.
2. **Evaluate Feature Splits:** For each available feature $A$, calculate the weighted average impurity of its child splits.
3. **Select Best Feature:** Pick the feature $A^*$ that yields maximum Information Gain (ID3) or minimum Gini Index (CART).
4. **Partition & Recurse:** Split dataset $S$ into subsets $\{S_1, S_2, \dots\}$ based on feature values and build child subtrees recursively.
5. **Apply Stopping Conditions:** Stop partitioning when:
   - All samples in a node belong to a single class (Pure node).
   - Maximum tree depth (`max_depth`) is reached.
   - Minimum number of samples per node (`min_samples_split`) is breached.

---

## 🎯 10-Mark Detailed Mathematical Derivation & Worked Numerical Example

### Problem Statement
Consider a binary classification dataset for predicting whether a student will pass an exam based on **Study Hours** (High vs Low).

**Dataset Summary ($S$):** Total Samples = 14
- Class **Pass** ($Y = 1$): 9 samples ($p_+ = 9/14$)
- Class **Fail** ($Y = 0$): 5 samples ($p_- = 5/14$)

---

### Step 1: Calculate Total Parent Entropy $H(S)$

$$H(S) = -p_+ \log_2(p_+) - p_- \log_2(p_-)$$

$$H(S) = -\left(\frac{9}{14}\right) \log_2\left(\frac{9}{14}\right) -\left(\frac{5}{14}\right) \log_2\left(\frac{5}{14}\right)$$

$$H(S) = - (0.643 \times -0.637) - (0.357 \times -1.486) = 0.410 + 0.530 = \mathbf{0.940 \text{ bits}}$$

---

### Step 2: Calculate Entropy After Splitting on Feature $A$ (Study Hours)

Feature **Study Hours** splits dataset into two subsets:
- **High Hours ($S_{High}$):** 8 samples → 6 Pass, 2 Fail.
  $$H(S_{High}) = -\left(\frac{6}{8}\right)\log_2\left(\frac{6}{8}\right) - \left(\frac{2}{8}\right)\log_2\left(\frac{2}{8}\right) = 0.811 \text{ bits}$$
- **Low Hours ($S_{Low}$):** 6 samples → 3 Pass, 3 Fail.
  $$H(S_{Low}) = -\left(\frac{3}{6}\right)\log_2\left(\frac{3}{6}\right) - \left(\frac{3}{6}\right)\log_2\left(\frac{3}{6}\right) = 1.000 \text{ bit (Max Impurity)}$$

---

### Step 3: Calculate Weighted Child Entropy & Information Gain

$$\text{Weighted Child Entropy} = \frac{8}{14}(0.811) + \frac{6}{14}(1.000) = 0.463 + 0.428 = \mathbf{0.891 \text{ bits}}$$

$$IG(S, \text{Study Hours}) = H(S) - \text{Weighted Child Entropy}$$
$$IG(S, \text{Study Hours}) = 0.940 - 0.891 = \mathbf{0.049 \text{ bits}}$$

Since $IG > 0$, splitting on **Study Hours** reduces overall uncertainty by **0.049 bits**.

---

## ✂️ Pruning Strategies to Prevent Overfitting

Decision Trees tend to overfit training data by growing deeply nested branches that memorize noise.

```
       [ Unpruned Tree ]                      [ Pruned Tree ]
            (Root)                                (Root)
           /      \                              /      \
      (Split 1)  (Split 2)                  (Pass)    (Split 2)
      /      \                                       /      \
  (Noise)  (Noise)                               (Pass)    (Fail)
```

### 1. Pre-Pruning (Early Stopping)
Halts tree growth during construction if specific hyperparameters are met:
- `max_depth`: Limits max distance from root to leaf.
- `min_samples_split`: Requires a minimum sample count to split an internal node.
- `min_impurity_decrease`: Only splits if impurity decreases by at least $\epsilon$.

### 2. Post-Pruning (Cost-Complexity Pruning)
Grows a full tree first, then collapses non-significant subtrees using a cost-complexity measure:
$$R_\alpha(T) = R(T) + \alpha |T|$$
Where $R(T)$ is training error, $|T|$ is the number of leaf nodes, and $\alpha \ge 0$ is the complexity penalty parameter.

---

## 📊 Comparison: ID3 vs C4.5 vs CART

| Feature | ID3 | C4.5 | CART |
| :--- | :--- | :--- | :--- |
| **Splitting Metric** | Information Gain | Gain Ratio | Gini Impurity / MSE |
| **Tree Structure** | Multi-way splits | Multi-way splits | Binary splits only |
| **Target Variable** | Categorical | Categorical & Continuous | Categorical & Regression |
| **Missing Values** | Not supported | Handled automatically | Surrogate splits |
| **Pruning Method** | None | Post-pruning (Error-based) | Cost-Complexity Pruning |

---

## ❓ Frequently Asked University Exam Questions

1. **[5 Marks]** Explain the difference between Gini Impurity and Entropy with formulas and graph representations.
2. **[10 Marks]** Given a 14-instance dataset, calculate Information Gain for all attributes and construct the root split node step-by-step.
3. **[5 Marks]** Why are decision trees prone to overfitting? Discuss pre-pruning vs post-pruning methods.

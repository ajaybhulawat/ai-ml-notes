---
title: "Decision Trees in Machine Learning"
description: "Understand how decision trees work, their splitting criteria, and real-world applications."
unit: "Unit 2 – Supervised Learning"
---

## What is a Decision Tree?

A Decision Tree is a **flowchart-like tree structure** where:
- Each **internal node** represents a feature/attribute
- Each **branch** represents a decision rule
- Each **leaf node** represents an outcome/class

## How It Works

1. Start at the root node with all training data.
2. Select the best feature to split on (based on a criterion).
3. Divide data into subsets and repeat for each child.
4. Stop when a stopping condition is met.

## Splitting Criteria

| Criterion | Formula | Used In |
|-----------|---------|---------|
| Gini Impurity | 1 - Σp² | CART |
| Entropy | -Σp·log(p) | ID3 |
| Information Gain | Entropy reduction | ID3, C4.5 |

## Advantages

- Easy to visualize and interpret
- No feature scaling required
- Handles both categorical and numerical data

## Disadvantages

- Prone to overfitting
- Unstable (small data changes → different tree)
- Biased toward features with more values

## Summary

Decision trees are powerful, interpretable models. For better accuracy, ensemble methods like Random Forest and Gradient Boosting are used.

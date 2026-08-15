---
title: "Linear Regression Explained"
description: "Learn the fundamentals of linear regression including cost function, gradient descent, and evaluation metrics."
unit: "Unit 1 – Supervised Learning"
---

## What is Linear Regression?

Linear Regression is a **supervised machine learning algorithm** used to predict a continuous output variable based on one or more input features.

## Types

- **Simple Linear Regression** — One input feature: y = mx + b
- **Multiple Linear Regression** — Multiple features: y = b₀ + b₁x₁ + b₂x₂ + ...

## Cost Function

The **Mean Squared Error (MSE)** is used to measure how well the model fits:

> MSE = (1/n) × Σ(yᵢ - ŷᵢ)²

The goal is to minimize this cost.

## Gradient Descent

Gradient Descent is used to update model weights iteratively:

> θ = θ - α × ∂J/∂θ

Where α is the learning rate.

## Evaluation Metrics

| Metric | Description |
|--------|-------------|
| R² Score | Proportion of variance explained |
| MAE | Mean Absolute Error |
| RMSE | Root Mean Square Error |

## Summary

Linear Regression is the simplest yet most foundational ML algorithm. Understanding it is the first step toward more complex models like Ridge, Lasso, and Polynomial Regression.

---
title: "Bayesian Networks Explained"
description: "Understand Bayesian Networks with examples, diagrams and exam-ready explanations."
unit: "Unit 2 – Probabilistic Models"
order: 1
subject: "Advanced Artificial Intelligence"
semester: "Semester 1"
keywords: ["bayesian networks", "DAG", "probabilistic graphical models", "CPT", "conditional probability"]
relatedSlugs: ["introduction-to-neural-networks", "k-means-clustering"]
---

## What is a Bayesian Network?

A Bayesian Network (also called a Belief Network) is a **probabilistic graphical model** that represents a set of variables and their conditional dependencies via a Directed Acyclic Graph (DAG).

## Key Components

1. **Nodes** — represent random variables
2. **Edges** — represent conditional dependencies
3. **Conditional Probability Tables (CPTs)** — quantify the relationships

## Example: Medical Diagnosis

Consider a simple network:
- Smoking → Cancer
- Cancer → Positive X-ray

If a patient smokes, the probability of cancer increases, which in turn affects the X-ray result.

## Applications

- Medical diagnosis
- Risk analysis
- Spam filtering
- Prediction systems
- Gene regulatory networks

## Advantages

- Handles uncertainty and incomplete data
- Provides interpretable results
- Can combine prior knowledge with observed data

## Summary

Bayesian Networks are powerful tools for reasoning under uncertainty. They combine graph theory with probability to model complex systems in a compact and understandable way.

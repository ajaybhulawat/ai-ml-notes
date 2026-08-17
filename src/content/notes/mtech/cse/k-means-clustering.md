---
title: "K-Means Clustering"
description: "Understand the K-Means clustering algorithm with step-by-step explanation and applications."
unit: "Unit 3 – Unsupervised Learning"
subject: "Advanced Machine Learning"
semester: "Semester 1"
keywords: ["K-means", "clustering", "unsupervised learning", "elbow method", "centroids"]
relatedSlugs: ["principal-component-analysis", "bayesian-networks"]
---

## What is K-Means Clustering?

K-Means is a popular **unsupervised learning algorithm** that groups data into K clusters based on feature similarity.

## Algorithm Steps

1. Choose K (number of clusters).
2. Randomly initialize K centroids.
3. Assign each data point to the nearest centroid.
4. Recalculate centroids as the mean of assigned points.
5. Repeat steps 3–4 until centroids don't change.

## Choosing K

Use the **Elbow Method**:
- Plot inertia (within-cluster sum of squares) vs. K.
- The "elbow" point indicates the optimal K.

## Advantages

- Simple and fast
- Scales well to large datasets
- Easy to implement

## Disadvantages

- Requires K to be specified in advance
- Sensitive to outliers
- Assumes spherical clusters

## Applications

- Customer segmentation
- Image compression
- Document clustering
- Anomaly detection

## Summary

K-Means is efficient for partitioning large datasets. However, choosing the right K and initializing centroids well are crucial for good results.

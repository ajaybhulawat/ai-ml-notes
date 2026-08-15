---
title: "Introduction to Neural Networks"
description: "Learn what neural networks are, how they work, and their key components."
unit: "Unit 3 – Deep Learning"
---

## What is a Neural Network?

A Neural Network is a **computing system inspired by the human brain**, consisting of layers of interconnected nodes (neurons) that process information using connectionist approaches.

## Structure

A standard neural network has three types of layers:

1. **Input Layer** — receives raw data
2. **Hidden Layers** — extract patterns and features
3. **Output Layer** — produces the final result

## How it Works

1. Data is fed into input neurons.
2. Each neuron applies a weighted sum + activation function.
3. The signal propagates forward (Forward Propagation).
4. Loss is calculated and weights are updated (Backpropagation).

## Common Activation Functions

| Function | Formula | Use Case |
|----------|---------|----------|
| ReLU | max(0, x) | Hidden layers |
| Sigmoid | 1/(1+e^-x) | Binary classification |
| Softmax | e^x / Σe^x | Multi-class output |

## Applications

- Image recognition
- Natural language processing
- Game playing (AlphaGo)
- Medical diagnosis

## Summary

Neural networks learn by adjusting weights based on errors. The more data and layers, the more powerful the model — this is the basis of Deep Learning.

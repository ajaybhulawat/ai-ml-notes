---
title: "Convolutional Neural Networks (CNNs)"
description: "Comprehensive guide to CNN architecture, convolution operations, pooling techniques, feature maps, and classic CNN architectures like LeNet and AlexNet."
unit: "Unit 3: Deep Learning"
---

## 1. Introduction to Convolutional Neural Networks

**Convolutional Neural Networks (CNNs)** are specialized deep feedforward neural networks designed specifically for processing structured grid data, such as 2D spatial images ($W \times H \times C$).

Unlike standard Multi-Layer Perceptrons (MLPs) where every neuron is connected to every input feature, CNNs leverage two core principles to dramatically reduce parameter counts:
1. **Local Receptive Fields**: Neurons process small localized patches of the input image.
2. **Shared Weights (Filter Weights)**: The same feature detector (kernel) is applied across the entire image space.

---

## 2. Core Layers of a CNN

A standard CNN pipeline consists of three primary types of layers:

### A. Convolutional Layer (`Conv2D`)
The core building block of a CNN. It computes the dot product between a sliding weight matrix (kernel/filter) and the local input region.

$$\text{Output Feature Map}(i, j) = \sum_{m} \sum_{n} I(i+m, j+n) \cdot K(m, n)$$

- **Stride ($S$)**: The step size by which the filter moves across the image.
- **Padding ($P$)**: Adding zero-value borders around the input matrix to control the spatial dimension of the output map.
  - *Valid Padding*: No padding ($P=0$). Output size shrinks.
  - *Same Padding*: Padding configured such that Output Width = Input Width ($P = (K - 1) / 2$).

$$\text{Output Size} = \left\lfloor \frac{W - K + 2P}{S} \right\rfloor + 1$$

### B. Pooling Layer (`MaxPool2D` / `AvgPool2D`)
Reduces the spatial dimensions ($W \times H$) of the feature maps, achieving **translation invariance** and lowering computational load.

- **Max Pooling**: Selects the maximum value in each pooling region. Preserves dominant features (edges, textures).
- **Average Pooling**: Computes the arithmetic mean of values in the window. Smooths spatial features.

### C. Fully Connected (FC) / Dense Layer
Flattens the 3D feature maps into a 1D vector and feeds it into standard dense layers to produce final class probabilities (e.g., via Softmax).

---

## 3. Comparative Summary of Classic CNN Architectures

| Architecture | Year | Layers | Key Innovations |
| :--- | :--- | :--- | :--- |
| **LeNet-5** | 1998 | 7 | First successful CNN for handwritten digit recognition (MNIST). Used Average Pooling and Sigmoid activations. |
| **AlexNet** | 2012 | 8 | Breakthrough ImageNet winner. Introduced **ReLU**, **Dropout**, GPU acceleration, and Overlapping Max Pooling. |
| **VGG-16** | 2014 | 16 | Demonstrated depth importance using uniform small **$3 \times 3$ filters** throughout the network. |
| **ResNet** | 2015 | 50/152 | Introduced **Residual Skip Connections** to train deep networks without vanishing gradients. |

---

## 4. Key Advantages of CNNs over MLPs

- **Parameter Reduction**: A $224 \times 224 \times 3$ image into an MLP requires millions of input weights. A $3 \times 3$ CNN filter requires only 9 weights per channel.
- **Spatial Hierarchy**: Lower layers detect simple features (edges, lines), while deeper layers combine them into complex objects (faces, cars).
- **Translation Invariance**: An object detected at the top-left of an image can be recognized anywhere in the image space.

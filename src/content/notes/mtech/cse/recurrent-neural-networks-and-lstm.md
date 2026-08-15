---
title: "Recurrent Neural Networks (RNNs) and LSTM"
description: "Detailed guide to sequence processing, recurrent hidden states, vanishing gradients, Long Short-Term Memory (LSTM) cell architecture, and GRUs."
unit: "Unit 3: Deep Learning"
---

## 1. Introduction to Recurrent Neural Networks

Standard feedforward networks assume all inputs and outputs are independent of each other. However, sequential tasks—such as time series forecasting, natural language processing, and audio recognition—require maintaining temporal context over time.

**Recurrent Neural Networks (RNNs)** introduce cyclical connections (recurrent loops) that pass the previous hidden state $h_{t-1}$ to the current time step $t$.

### Standard RNN Update Equation

$$h_t = \tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$$

$$y_t = \text{softmax}(W_{hy} h_t + b_y)$$

Where:
- $x_t$: Input vector at time step $t$.
- $h_t$: Hidden state carrying sequence memory at time step $t$.
- $W_{hh}, W_{xh}, W_{hy}$: Shared weight matrices across all time steps.

---

## 2. The Vanishing & Exploding Gradient Problem

During **Backpropagation Through Time (BPTT)**, gradients are repeatedly multiplied through the recurrent weight matrix $W_{hh}$ across many time steps.

- **Vanishing Gradient**: If eigenvalues of $W_{hh} < 1$, gradients decay exponentially to zero as sequence length grows. The model forgets long-range dependencies.
- **Exploding Gradient**: If eigenvalues of $W_{hh} > 1$, gradients grow exponentially, causing numerical instability (fixed using **Gradient Clipping**).

---

## 3. Long Short-Term Memory (LSTM) Architecture

To solve the vanishing gradient problem, **Hochreiter & Schmidhuber (1997)** introduced the **LSTM** cell. An LSTM replaces the simple $\tanh$ node with a **Cell State ($C_t$)** governed by three specialized gating mechanisms:

### A. Forget Gate ($f_t$)
Decides what information to discard from the previous cell state $C_{t-1}$.

$$f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)$$

### B. Input Gate ($i_t$) & Candidate Value ($\tilde{C}_t$)
Decides which new information to store in the cell state.

$$i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)$$

$$\tilde{C}_t = \tanh(W_c \cdot [h_{t-1}, x_t] + b_c)$$

### C. Cell State Update ($C_t$)
Updates the internal long-term memory cell.

$$C_t = f_t * C_{t-1} + i_t * \tilde{C}_t$$

### D. Output Gate ($o_t$) & Hidden State ($h_t$)
Controls what part of the internal memory is exposed as the output hidden state.

$$o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)$$

$$h_t = o_t * \tanh(C_t)$$

---

## 4. Comparison: Standard RNN vs. LSTM vs. GRU

| Model | Memory Mechanism | Gates Count | Parameters | Best Suited For |
| :--- | :--- | :--- | :--- | :--- |
| **Vanilla RNN** | Single Hidden State ($h_t$) | 0 | Lowest | Short sequences ($T < 10$) |
| **LSTM** | Dual State: Cell ($C_t$) & Hidden ($h_t$) | 3 (Forget, Input, Output) | Highest | Long dependencies ($T > 100$) |
| **GRU** | Single State ($h_t$) | 2 (Reset, Update) | ~25% fewer than LSTM | Faster training on medium data |

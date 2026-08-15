export type MCQ = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  category: "AI Basics" | "Machine Learning" | "Deep Learning" | "Probabilistic Models"
}

export const mcqCategories = [
  "All",
  "AI Basics",
  "Machine Learning",
  "Deep Learning",
  "Probabilistic Models",
] as const

export const mcqs: MCQ[] = [
  {
    id: "mcq-1",
    category: "AI Basics",
    question: "Which of the following is considered a subset of Artificial Intelligence that enables systems to learn from data?",
    options: [
      "Deep Learning",
      "Machine Learning",
      "Robotics",
      "Natural Language Processing"
    ],
    correctIndex: 1,
    explanation: "Machine Learning (ML) is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed."
  },
  {
    id: "mcq-2",
    category: "AI Basics",
    question: "What is the primary goal of the Turing Test in AI?",
    options: [
      "To test a computer's processing speed",
      "To evaluate if a machine can exhibit intelligent behavior equivalent to a human",
      "To measure storage capacity of neural networks",
      "To test graphic rendering capabilities"
    ],
    correctIndex: 1,
    explanation: "The Turing Test, developed by Alan Turing, tests a machine's ability to exhibit intelligent behavior indistinguishable from that of a human."
  },
  {
    id: "mcq-3",
    category: "Machine Learning",
    question: "Which algorithm is an example of an Unsupervised Machine Learning method?",
    options: [
      "Linear Regression",
      "Decision Tree",
      "K-Means Clustering",
      "Logistic Regression"
    ],
    correctIndex: 2,
    explanation: "K-Means Clustering is an unsupervised algorithm that groups unlabeled data into K distinct clusters based on feature similarity."
  },
  {
    id: "mcq-4",
    category: "Machine Learning",
    question: "In Decision Trees, which criterion measures the reduction in entropy after a split?",
    options: [
      "Information Gain",
      "Gini Impurity",
      "Mean Squared Error",
      "Variance Ratio"
    ],
    correctIndex: 0,
    explanation: "Information Gain is the measure of the decrease in entropy after a dataset is split on an attribute."
  },
  {
    id: "mcq-5",
    category: "Machine Learning",
    question: "What is the function of the Kernel Trick in Support Vector Machines (SVM)?",
    options: [
      "To increase training speed by downsampling data",
      "To implicitly map non-linearly separable data into a higher-dimensional space where it is linearly separable",
      "To remove noise from target class labels",
      "To calculate the average distance of points to the centroid"
    ],
    correctIndex: 1,
    explanation: "The Kernel Trick computes inner products in a high-dimensional feature space without explicitly computing coordinates, making non-linear classification computationally efficient."
  },
  {
    id: "mcq-6",
    category: "Machine Learning",
    question: "Principal Component Analysis (PCA) selects principal components based on which property?",
    options: [
      "Maximizing the distance between centroids",
      "Maximizing the variance of projected features along orthogonal axes",
      "Minimizing classification accuracy",
      "Maximizing entropy of class labels"
    ],
    correctIndex: 1,
    explanation: "PCA seeks orthogonal principal components along which the variance of the data projection is maximized."
  },
  {
    id: "mcq-7",
    category: "Deep Learning",
    question: "Which layer in a CNN reduces spatial dimensions while preserving dominant features?",
    options: [
      "Convolutional Layer",
      "Pooling Layer (e.g. Max Pooling)",
      "Batch Normalization Layer",
      "Softmax Layer"
    ],
    correctIndex: 1,
    explanation: "Pooling layers downsample feature map dimensions, reducing computation and achieving translation invariance."
  },
  {
    id: "mcq-8",
    category: "Deep Learning",
    question: "Which component of an LSTM cell determines how much information from the previous cell state should be discarded?",
    options: [
      "Input Gate",
      "Forget Gate",
      "Output Gate",
      "Candidate State"
    ],
    correctIndex: 1,
    explanation: "The Forget Gate outputs values between 0 and 1 via a Sigmoid function to decide what information to drop from the cell state."
  },
  {
    id: "mcq-9",
    category: "Deep Learning",
    question: "Which activation function outputs values in the range [0, 1] and is commonly used for binary classification?",
    options: [
      "ReLU",
      "Sigmoid",
      "Leaky ReLU",
      "Tanh"
    ],
    correctIndex: 1,
    explanation: "The Sigmoid activation function maps any real value into a range between 0 and 1, making it ideal for binary classification probability estimation."
  },
  {
    id: "mcq-10",
    category: "Probabilistic Models",
    question: "What type of graph represents a Bayesian Network?",
    options: [
      "Undirected Cyclic Graph",
      "Directed Acyclic Graph (DAG)",
      "Bipartite Graph",
      "Complete Graph"
    ],
    correctIndex: 1,
    explanation: "A Bayesian Network is represented as a Directed Acyclic Graph (DAG), where nodes represent random variables and directed edges represent probabilistic dependencies."
  }
]

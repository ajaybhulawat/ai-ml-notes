"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function FormulasPage() {
  // 1. CNN Output Size State
  const [cnnW, setCnnW] = useState(224)
  const [cnnK, setCnnK] = useState(3)
  const [cnnP, setCnnP] = useState(1)
  const [cnnS, setCnnS] = useState(1)

  const cnnOutput = Math.floor((cnnW - cnnK + 2 * cnnP) / cnnS) + 1

  // 2. Sigmoid Activation State
  const [sigX, setSigX] = useState(1.5)
  const sigResult = 1 / (1 + Math.exp(-sigX))

  // 3. Bayes Theorem State
  const [priorA, setPriorA] = useState(0.01) // P(A)
  const [likelihood, setLikelihood] = useState(0.95) // P(B|A)
  const [marginalB, setMarginalB] = useState(0.05) // P(B)

  const posterior = marginalB > 0 ? (likelihood * priorA) / marginalB : 0

  // 4. MSE Loss State
  const [yTrue, setYTrue] = useState([2.0, 3.5, 4.0])
  const [yPred, setYPred] = useState([2.2, 3.1, 4.5])

  const mseResult =
    yTrue.length > 0
      ? yTrue.reduce((sum, actual, idx) => sum + Math.pow(actual - (yPred[idx] || 0), 2), 0) /
        yTrue.length
      : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">
            AI &amp; ML Formula Calculators
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Interactive real-time calculators for core exam equations and neural network parameters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calculator 1: CNN Output Dimension */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                  Deep Learning
                </span>
                <span className="text-xs font-mono text-gray-400">O = ⌊(W - K + 2P)/S⌋ + 1</span>
              </div>

              <h2 className="text-xl font-bold mb-4">
                CNN Feature Map Output Size
              </h2>

              <div className="space-y-4 text-sm mb-6">
                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Input Dimension (W):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{cnnW} px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1024"
                    value={cnnW}
                    onChange={(e) => setCnnW(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Kernel/Filter Size (K):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{cnnK} × {cnnK}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="11"
                    step="2"
                    value={cnnK}
                    onChange={(e) => setCnnK(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Padding (P):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{cnnP}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={cnnP}
                    onChange={(e) => setCnnP(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Stride (S):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{cnnS}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={cnnS}
                    onChange={(e) => setCnnS(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1">Calculated Output Feature Map:</span>
              <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono">
                {cnnOutput} × {cnnOutput} px
              </span>
            </div>
          </div>

          {/* Calculator 2: Sigmoid Activation */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                  Activation Functions
                </span>
                <span className="text-xs font-mono text-gray-400">σ(x) = 1 / (1 + e^-x)</span>
              </div>

              <h2 className="text-xl font-bold mb-4">
                Sigmoid Activation Probability
              </h2>

              <div className="space-y-4 text-sm mb-6">
                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Input Value (x):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{sigX.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.1"
                    value={sigX}
                    onChange={(e) => setSigX(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1">Output Probability σ({sigX.toFixed(1)}):</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                {sigResult.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Calculator 3: Bayes Theorem */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                  Probabilistic Models
                </span>
                <span className="text-xs font-mono text-gray-400">P(A|B) = P(B|A)P(A) / P(B)</span>
              </div>

              <h2 className="text-xl font-bold mb-4">
                Bayes&apos; Theorem Posterior Probability
              </h2>

              <div className="space-y-4 text-sm mb-6">
                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Prior P(A):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{(priorA * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.5"
                    step="0.005"
                    value={priorA}
                    onChange={(e) => setPriorA(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Likelihood P(B|A):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{(likelihood * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.01"
                    value={likelihood}
                    onChange={(e) => setLikelihood(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Marginal Evidence P(B):</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{(marginalB * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={marginalB}
                    onChange={(e) => setMarginalB(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-100 dark:border-purple-900 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1">Posterior P(A|B):</span>
              <span className="text-2xl font-black text-purple-700 dark:text-purple-300 font-mono">
                {(posterior * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Calculator 4: Mean Squared Error */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                  Loss Functions
                </span>
                <span className="text-xs font-mono text-gray-400">MSE = (1/N)Σ(y - y_hat)²</span>
              </div>

              <h2 className="text-xl font-bold mb-4">
                Mean Squared Error (MSE)
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Actual Targets (y):
                  </label>
                  <input
                    type="text"
                    value={yTrue.join(", ")}
                    onChange={(e) =>
                      setYTrue(
                        e.target.value
                          .split(",")
                          .map((val) => parseFloat(val.trim()))
                          .filter((v) => !isNaN(v))
                      )
                    }
                    className="w-full px-3 py-2 border dark:border-gray-800 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Predicted Targets (y_hat):
                  </label>
                  <input
                    type="text"
                    value={yPred.join(", ")}
                    onChange={(e) =>
                      setYPred(
                        e.target.value
                          .split(",")
                          .map((val) => parseFloat(val.trim()))
                          .filter((v) => !isNaN(v))
                      )
                    }
                    className="w-full px-3 py-2 border dark:border-gray-800 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1">Calculated MSE Loss:</span>
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300 font-mono">
                {mseResult.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/notes"
            className="inline-block bg-white dark:bg-gray-900 border dark:border-gray-800 px-6 py-3 rounded-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-xs"
          >
            ← Back to Notes Platform
          </Link>
        </div>
      </main>
    </div>
  )
}

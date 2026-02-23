export default function PrepareSection() {
  const items = [
    "10 Mark Answers",
    "Detailed Diagrams",
    "MCQ Practice",
    "Quick Revision Notes"
  ]

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold mb-12">
          Prepare for Your Exams
        </h3>

        <div className="grid md:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div key={index}>
              <div className="bg-blue-100 w-20 h-20 mx-auto rounded-full mb-4"></div>
              <h4 className="font-medium">{item}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
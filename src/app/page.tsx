import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-blue-700">OptiFlow</div>
        <div className="flex gap-3">
          <Button variant="ghost" render={<Link href="/contact" />}>
            Contact
          </Button>
          <Button render={<Link href="/login" />}>Sign In</Button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Track glass orders from{" "}
            <span className="text-blue-600">prescription</span> to{" "}
            <span className="text-teal-600">pickup</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            OptiFlow is a visual Kanban board built for optician shops. See
            every order at a glance, reduce delays, and keep your whole team in
            sync — on any tablet.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" render={<Link href="/contact" />}>
              Request a Demo
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Try It Now
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <FeatureCard
            title="Snap & Auto-Fill"
            description="Take a photo of the prescription. OCR extracts the data — no manual entry needed."
            color="bg-blue-100 text-blue-700"
          />
          <FeatureCard
            title="Visual Progress"
            description="Five clear stages from order to pickup. Drag cards across columns as work progresses."
            color="bg-orange-100 text-orange-700"
          />
          <FeatureCard
            title="Team Visibility"
            description="Every employee sees the same live board. No more sticky notes or spreadsheets."
            color="bg-teal-100 text-teal-700"
          />
        </div>

        {/* Stages Preview */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Five stages, zero confusion
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {[
              { label: "Pending Order", color: "border-blue-400 bg-blue-50" },
              {
                label: "Awaiting Delivery",
                color: "border-orange-400 bg-orange-50",
              },
              {
                label: "Ready to Assemble",
                color: "border-green-400 bg-green-50",
              },
              { label: "In Assembly", color: "border-purple-400 bg-purple-50" },
              {
                label: "Ready for Pickup",
                color: "border-teal-400 bg-teal-50",
              },
            ].map((stage) => (
              <div
                key={stage.label}
                className={`flex-shrink-0 w-48 h-32 rounded-xl border-2 ${stage.color} flex items-center justify-center`}
              >
                <span className="font-semibold text-gray-700 text-center px-2">
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        OptiFlow — Built for opticians, by people who care about clarity.
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 bg-white">
      <div
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${color}`}
      >
        {title}
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

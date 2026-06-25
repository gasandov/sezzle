import { Calculator } from "./organisms/Calculator";

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-calc-bg">
      <h1 className="text-white text-3xl font-bold mb-8 tracking-tight">
        Sezzle <span className="text-calc-key-eq">Calculator</span>
      </h1>
      <Calculator />
      <p className="text-gray-600 text-xs mt-6">
        Supports: <code>+ - * / ^ sqrt() pow() %</code> · Keyboard enabled
      </p>
    </main>
  );
}

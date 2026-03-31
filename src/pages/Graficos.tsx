import "../css/index.css"
import "../css/variables.css"
import logo from "../assets/logo.png"

function App() {

  return (
    <section className="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--font-color)] font-sans">
      <nav className="flex justify-between items-center p-6">
        <button className="px-4 py-2 font-semibold text-sm rounded-full bg-white shadow-sm hover:ring-2 hover:ring-[var(--comp-color)] transition-all">Notificações</button>
        <button className="px-4 py-2 font-semibold text-sm rounded-full bg-white shadow-sm hover:ring-2 hover:ring-[var(--comp-color)] transition-all">Configurações</button>
      </nav>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
        <div className="relative w-64 h-64 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-[8px] border-[var(--comp-color)] mb-8 flex-shrink-0">
          <img src={logo} alt="Trotineta" className="w-24 h-24 object-contain mb-4" />
          <p className="text-5xl font-extrabold text-[var(--font-color)]">
            <span>100%
            </span>
          </p>
        </div>
      </main>

      <footer className="flex w-full mt-auto bg-[var(--font-color)] text-[var(--bg-color)]">
        <button className="flex-1 py-5 text-sm font-bold uppercase tracking-wider hover:bg-[var(--comp-color)] hover:text-[var(--font-color)] transition-colors duration-300">Gráficos</button>
        <button className="flex-1 py-5 text-sm font-bold uppercase tracking-wider bg-[var(--comp-color)] text-[var(--font-color)] transition-colors duration-300 border-l border-[var(--bg-color)]/20">Home</button>
        <button className="flex-1 py-5 text-sm font-bold uppercase tracking-wider hover:bg-[var(--comp-color)] hover:text-[var(--font-color)] transition-colors duration-300 border-l border-[var(--bg-color)]/20">Controlador</button>
      </footer>
    </section>
  )
}

export default App

import './globals.css';

export const metadata = {
  title: 'ContextLGPD-Negotiator — CIn-UFPE',
  description: 'Negociação entre Computação Sensível ao Contexto e a LGPD por meio da Engenharia de Requisitos de Software',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-darkbg text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

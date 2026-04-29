const MESSAGES: { min: number; text: string }[] = [
  { min: 0, text: "Respira. Recomeçar é parte do caminho. Você consegue." },
  { min: 3, text: "Você aguentou por alguns dias. Voltar agora é um passo corajoso." },
  { min: 7, text: "Uma semana sem cometer já é prova de força. Vamos ao próximo ciclo." },
  { min: 14, text: "Duas semanas: seu cérebro aprendeu um novo padrão. Continue." },
  { min: 30, text: "Um mês é transformação. Mesmo com tropeço, você está avançando." },
  { min: 60, text: "Você construiu disciplina. Ajuste o rumo e siga em frente." },
];

export function getMotivationalMessage(daysWithout: number) {
  const sorted = [...MESSAGES].sort((a, b) => a.min - b.min);
  const match = sorted.reduce((acc, m) => (m.min <= daysWithout ? m : acc), sorted[0]);
  return match.text;
}

export function formatDaysWithout(daysWithout: number) {
  // Simples para PT-BR.
  if (daysWithout === 1) return "1 dia";
  return `${daysWithout} dias`;
}


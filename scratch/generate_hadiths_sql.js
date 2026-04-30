const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('hadiths_raw.json', 'utf8'));

// High quality manual-style translations for 50 selected hadiths
const selected = [
  {
    topic: "Patience",
    original: "Verily, the patience is at the first stroke of a calamity.",
    source: "Sahih Bukhari",
    portuguese: "Verdadeiramente, a paciência é aquela demonstrada no primeiro momento da calamidade.",
    arabic: "إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الأُولَى"
  },
  {
    topic: "Repentance",
    original: "Allah is more pleased with the repentance of His slave than any one of you is with finding his lost camel in a barren desert.",
    source: "Sahih Muslim",
    portuguese: "Allah fica mais satisfeito com o arrependimento do Seu servo do que qualquer um de vós ficaria ao reencontrar o seu camelo perdido num deserto vasto.",
    arabic: "لَلَّهُ أَشَدُّ فَرَحًا بِتَوْبَةِ عَبْدِهِ"
  },
  {
    topic: "Overcoming",
    original: "The strong man is not the one who can wrestle, but the strong man is the one who can control himself when he is angry.",
    source: "Sahih Bukhari",
    portuguese: "O homem forte não é aquele que vence na luta, mas sim aquele que consegue controlar a si mesmo no momento da raiva.",
    arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ"
  },
  {
    topic: "Repentance",
    original: "All the sons of Adam are sinners, but the best of sinners are those who repent.",
    source: "Sunan at-Tirmidhi",
    portuguese: "Todos os filhos de Adão são pecadores, mas os melhores entre os pecadores são aqueles que se arrependem.",
    arabic: "كُلُّ بَنِي آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ"
  },
  {
    topic: "Patience",
    original: "How wonderful is the case of a believer; there is good for him in everything and this applies only to a believer. If prosperity attends him, he expresses gratitude to Allah and that is good for him; and if adversity befalls him, he endures it patiently and that is better for him.",
    source: "Sahih Muslim",
    portuguese: "Quão admirável é a situação do crente; há bem para ele em tudo, e isto aplica-se apenas ao crente. Se a prosperidade o alcança, ele agradece a Allah e isso é bom para ele; e se a adversidade o atinge, ele suporta-a com paciência e isso é melhor para ele.",
    arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ"
  },
  {
    topic: "Forgiveness",
    original: "If you were not to commit sins, Allah would have swept you out of existence and would have replaced you by another people who have committed sin, and then asked forgiveness from Allah, and He would have granted them pardon.",
    source: "Sahih Muslim",
    portuguese: "Se não cometêsseis pecados, Allah faria-vos desaparecer e substituir-vos-ia por outro povo que pecasse e, em seguida, pedisse perdão a Allah, e Ele perdoaria-os.",
    arabic: "لَوْ لَمْ تُذْنِبُوا لَذَهَبَ اللَّهُ بِكُمْ وَلَجَاءَ بِقَوْمٍ يُذْنِبُونَ"
  },
  {
    topic: "Patience",
    original: "No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that.",
    source: "Sahih Bukhari",
    portuguese: "Nenhum cansaço, doença, preocupação, tristeza, dano ou angústia atinge um muçulmano, mesmo que seja o picar de um espinho, sem que Allah expie alguns dos seus pecados por causa disso.",
    arabic: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ وَلاَ هَمٍّ وَلاَ حُزْنٍ وَلاَ أَذًى وَلاَ غَمٍّ"
  },
  {
    topic: "Overcoming",
    original: "Verily, Allah does not look towards your bodies nor towards your appearances, but He looks towards your hearts.",
    source: "Sahih Muslim",
    portuguese: "Certamente, Allah não olha para os vossos corpos nem para as vossas aparências, mas sim para os vossos corações.",
    arabic: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ"
  },
  {
    topic: "Repentance",
    original: "One who repents from sin is like one who has no sin.",
    source: "Sunan Ibn Majah",
    portuguese: "Aquele que se arrepende de um pecado é como aquele que não tem pecado algum.",
    arabic: "التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لاَ ذَنْبَ لَهُ"
  },
  {
    topic: "Patience",
    original: "The greatness of the reward is with the greatness of the trial. If Allah loves a people, He puts them to trial.",
    source: "Sunan at-Tirmidhi",
    portuguese: "A magnitude da recompensa está proporcional à magnitude da provação. Quando Allah ama um povo, Ele coloca-o à prova.",
    arabic: "عِظَمُ الْجَزَاءِ مَعَ عِظَمِ الْبَلاَءِ"
  },
  {
    topic: "Repentance",
    original: "My Lord! Forgive me and accept my repentance, for You are the Acceptor of Repentance, the Forgiving.",
    source: "Sunan Abi Dawud",
    portuguese: "Meu Senhor! Perdoa-me e aceita o meu arrependimento, pois Tu és O Misericordioso, O Perdoador.",
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الْغَفُورُ"
  },
  {
    topic: "Overcoming",
    original: "Look at those who are lower than you but do not look at those who are higher than you, lest you should underestimate the favors of Allah upon you.",
    source: "Sahih Muslim",
    portuguese: "Olhai para aqueles que estão em situação inferior à vossa e não para os que estão acima de vós, para que não subestimeis as graças de Allah sobre vós.",
    arabic: "انْظُرُوا إِلَى مَنْ هُوَ أَسْفَلَ مِنْكُمْ وَلاَ تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ"
  },
  {
    topic: "Patience",
    original: "Whoever remains patient, Allah will make him patient. And nobody can be given a blessing better and greater than patience.",
    source: "Sahih Bukhari",
    portuguese: "Quem se esforça para ser paciente, Allah concederá paciência. E ninguém recebeu uma dádiva melhor e mais ampla do que a paciência.",
    arabic: "وَمَنْ يَتَصَبَّرْ يُصَبِّرْهُ اللَّهُ، وَمَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ"
  },
  {
    topic: "Repentance",
    original: "If the slave comes to Me by a span, I go to him by a cubit. If he comes to Me by a cubit, I go to him by a fathom. If he comes to Me walking, I go to him at speed.",
    source: "Sahih Bukhari",
    portuguese: "Se o Meu servo se aproxima de Mim um palmo, Eu aproximo-Me dele um braço. Se ele se aproxima um braço, Eu aproximo-Me dele a distância de dois braços estendidos. Se ele vem a Mim caminhando, Eu vou até ele correndo.",
    arabic: "وَإِنْ تَقَرَّبَ إِلَىَّ شِبْرًا تَقَرَّبْتُ إِلَيْهِ ذِرَاعًا"
  },
  {
    topic: "Overcoming",
    original: "A believer is not stung from the same hole twice.",
    source: "Sahih Bukhari",
    portuguese: "Um crente não é picado pelo mesmo buraco duas vezes (aprende com os seus erros).",
    arabic: "لاَ يُلْدَغُ الْمُؤْمِنُ مِنْ جُحْرٍ وَاحِدٍ مَرَّتَيْنِ"
  }
];

// To reach 50, I will add more manually selected ones
const additional = [
  { topic: "Patience", original: "Patience is a brightness.", portuguese: "A paciência é uma luz resplandecente.", source: "Sahih Muslim" },
  { topic: "Repentance", original: "Allah accepts the repentance of a slave as long as he is not at the point of death.", portuguese: "Allah aceita o arrependimento do Seu servo enquanto este não estiver no momento final da morte.", source: "Sunan at-Tirmidhi" },
  { topic: "Overcoming", original: "The best among you are those who have the best manners and character.", portuguese: "Os melhores de vós são aqueles que possuem o melhor caráter e conduta.", source: "Sahih Bukhari" },
  { topic: "Forgiveness", original: "Be merciful to those on earth and the One in the heavens will have mercy upon you.", portuguese: "Sê misericordioso com quem está na terra e Aquele que está nos céus terá misericórdia de ti.", source: "Sunan at-Tirmidhi" },
  { topic: "Patience", original: "Verily, with hardship comes ease.", portuguese: "Certamente, com a dificuldade vem a facilidade.", source: "Quran 94:6 (often quoted as Hadith point)" },
  { topic: "Repentance", original: "A man committed a sin and said: O Allah, forgive me. Allah said: My slave has committed a sin and realized that he has a Lord who forgives sin and takes to account for it.", portuguese: "Um homem pecou e disse: 'Ó Allah, perdoa-me'. Allah disse: 'O Meu servo pecou e reconheceu que tem um Senhor que perdoa o pecado e dele pede contas'.", source: "Sahih Muslim" },
  { topic: "Overcoming", original: "He who believes in Allah and the Last Day should either speak good or remain silent.", portuguese: "Quem crê em Allah e no Último Dia, que diga o bem ou permaneça em silêncio.", source: "Sahih Bukhari" },
  { topic: "Patience", original: "The world is a prison for the believer and a paradise for the disbeliever.", portuguese: "Este mundo é uma prisão para o crente e um paraíso para quem não crê.", source: "Sahih Muslim" },
  { topic: "Repentance", original: "Allah stretches out His hand by night that the sinner of the day may repent.", portuguese: "Allah estende a Sua mão durante a noite para que o pecador do dia se arrependa.", source: "Sahih Muslim" },
  { topic: "Overcoming", original: "Avoid that which is forbidden and you will be the best of worshippers.", portuguese: "Evita o que é proibido e serás o melhor dos adoradores.", source: "Sunan at-Tirmidhi" },
  { topic: "Patience", original: "Wait for the relief, for waiting for relief is an act of worship.", portuguese: "Espera pelo alívio, pois esperar pelo alívio é, por si só, um ato de adoração.", source: "Sunan at-Tirmidhi" },
  { topic: "Forgiveness", original: "Whoever conceals the faults of a Muslim, Allah will conceal his faults in this world and the Hereafter.", portuguese: "Aquele que oculta as falhas de um muçulmano, Allah ocultará as suas falhas neste mundo e no outro.", source: "Sahih Muslim" },
  { topic: "Overcoming", original: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", portuguese: "As ações mais amadas por Allah são aquelas que são mais constantes, mesmo que sejam pequenas.", source: "Sahih Bukhari" },
  { topic: "Repentance", original: "Tears shed out of fear of Allah will not return to the eye until the milk returns to the udder.", portuguese: "Lágrimas derramadas por temor a Allah não retornarão ao olho, assim como o leite não retorna ao úbere.", source: "Sunan at-Tirmidhi" },
  { topic: "Patience", original: "A Muslim is the brother of a Muslim. He does not wrong him nor does he hand him over to an enemy.", portuguese: "Um muçulmano é irmão de outro muçulmano. Ele não o oprime nem o abandona diante do inimigo.", source: "Sahih Bukhari" },
  { topic: "Overcoming", original: "Do not consider any good deed as insignificant, even if it is meeting your brother with a cheerful face.", portuguese: "Não consideres nenhuma boa ação como insignificante, mesmo que seja apenas receber o teu irmão com um rosto alegre.", source: "Sahih Muslim" },
  { topic: "Repentance", original: "Verily, good deeds do away with evil deeds.", portuguese: "Certamente, as boas ações apagam as más ações.", source: "Quran/Hadith consensus" },
  { topic: "Patience", original: "If you ask, ask Allah; and if you seek help, seek help from Allah.", portuguese: "Se pedires algo, pede a Allah; se buscares ajuda, busca a ajuda de Allah.", source: "Sunan at-Tirmidhi" },
  { topic: "Overcoming", original: "Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.", portuguese: "Quem trilha um caminho em busca de conhecimento, Allah facilitará para ele um caminho para o Paraíso.", source: "Sahih Muslim" },
  { topic: "Forgiveness", original: "Charity does not decrease wealth.", portuguese: "A caridade não diminui a riqueza.", source: "Sahih Muslim" },
  { topic: "Patience", original: "Religion is easy, and no one overburdens himself in religion but he will be overwhelmed.", portuguese: "A religião é fácil, e ninguém se sobrecarrega na religião sem que seja vencido por ela.", source: "Sahih Bukhari" },
  { topic: "Repentance", original: "Rejoice and hope for what will please you.", portuguese: "Alegra-te e espera por aquilo que te fará feliz.", source: "Sahih Bukhari" },
  { topic: "Overcoming", original: "The best jihad is to struggle against your own soul and desires for the sake of Allah.", portuguese: "A melhor luta (jihad) é lutar contra a sua própria alma e desejos por causa de Allah.", source: "Daylami" },
  { topic: "Patience", original: "Speak what is true even if it is bitter.", portuguese: "Diz a verdade, mesmo que seja amarga.", source: "Ibn Hibban" },
  { topic: "Repentance", original: "Allah accepts the repentance of whoever repents before the sun rises from the west.", portuguese: "Allah aceita o arrependimento de quem se arrepende antes que o sol nasça no ocidente.", source: "Sahih Muslim" },
  { topic: "Overcoming", original: "Fear Allah wherever you are, and follow up a bad deed with a good one and it will wipe it out.", portuguese: "Teme a Allah onde quer que estejas, e segue uma má ação com uma boa, pois ela a apagará.", source: "Sunan at-Tirmidhi" },
  { topic: "Patience", original: "The strong believer is better and more beloved to Allah than the weak believer.", portuguese: "O crente forte é melhor e mais amado por Allah do que o crente fraco.", source: "Sahih Muslim" },
  { topic: "Forgiveness", original: "He who does not show mercy will not be shown mercy.", portuguese: "Aquele que não demonstra misericórdia não receberá misericórdia.", source: "Sahih Bukhari" },
  { topic: "Overcoming", original: "Wealth is not having many possessions, but wealth is being content with oneself.", portuguese: "A riqueza não consiste em ter muitos bens, mas sim em estar satisfeito consigo mesmo.", source: "Sahih Bukhari" },
  { topic: "Patience", original: "Be in this world as if you were a stranger or a traveler.", portuguese: "Sê neste mundo como se fosses um estranho ou um viajante.", source: "Sahih Bukhari" },
  { topic: "Repentance", original: "The gates of repentance are open until the sun rises from the west.", portuguese: "As portas do arrependimento estão abertas até que o sol nasça no ocidente.", source: "Sahih Muslim" },
  { topic: "Overcoming", original: "A man is upon the religion of his friend, so let each of you look at whom he befriends.", portuguese: "O homem segue a religião do seu amigo, portanto, que cada um de vós veja bem quem escolhe para amigo.", source: "Sunan Abi Dawud" },
  { topic: "Patience", original: "Worship Allah as if you see Him, for if you do not see Him, He sees you.", portuguese: "Adora a Allah como se O visses; pois, se tu não O vês, Ele certamente te vê.", source: "Sahih Bukhari" },
  { topic: "Forgiveness", original: "Forgive, and you will be forgiven.", portuguese: "Perdoa, e serás perdoado.", source: "Musnad Ahmad" },
  { topic: "Overcoming", original: "The pen has been lifted and the pages have dried.", portuguese: "A caneta foi erguida e as páginas secaram (o que está destinado acontecerá).", source: "Sunan at-Tirmidhi" }
];

const finalHadiths = [...selected, ...additional].slice(0, 50);

let sql = `CREATE TABLE IF NOT EXISTS public.hadiths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  content_pt text NOT NULL,
  content_en text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.hadiths ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública de Hadiths
CREATE POLICY "hadiths_read_all" ON public.hadiths
  FOR SELECT USING (true);
\n\n`;

finalHadiths.forEach(h => {
  const content = h.portuguese.replace(/'/g, "''");
  const en = h.original.replace(/'/g, "''");
  sql += `INSERT INTO public.hadiths (topic, content_pt, content_en, source) VALUES ('${h.topic}', '${content}', '${en}', '${h.source}');\n`;
});

fs.writeFileSync('insert_hadiths.sql', sql);
console.log("SQL file generated with 50 hadiths.");

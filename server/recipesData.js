export const fitRecipes = [
  // ================= CAFE DA MANHÃ (10) =================
  {
    id: 'rec-cm-1', name: 'Panqueca Fit de Aveia', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata os ovos com aveia.\n2. Frite em frigideira antiaderente.\n3. Sirva com frutas.', notes: 'Rico em fibras.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 100, unit: 'g', protein: 13 }, { food_name: 'Aveia em Flocos', quantity: 30, unit: 'g', protein: 4.2 }]
  },
  {
    id: 'rec-cm-2', name: 'Omelete de Espinafre', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata os ovos.\n2. Refogue espinafre.\n3. Misture e doure dos dois lados.', notes: 'Proteína pura.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 150, unit: 'g', protein: 19.5 }, { food_name: 'Queijo Minas Frescal', quantity: 30, unit: 'g', protein: 4.2 }]
  },
  {
    id: 'rec-cm-3', name: 'Crepioca de Queijo', category: 'Café da Manhã', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture 1 ovo com 2 colheres de goma de tapioca.\n2. Recheie com queijo minas.', notes: 'Sem glúten.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Queijo Minas Frescal', quantity: 50, unit: 'g', protein: 7 }]
  },
  {
    id: 'rec-cm-4', name: 'Mingau de Aveia Proteico', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Cozinhe a aveia com leite desnatado ou água.\n2. Desligue o fogo e adicione o whey.', notes: 'Confortável e saciante.',
    ingredients: [{ food_name: 'Aveia em Flocos', quantity: 40, unit: 'g', protein: 5.6 }, { food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-cm-5', name: 'Vitamina de Frutas com Whey', category: 'Café da Manhã', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata no liquidificador leite, frutas e whey.', notes: 'Para dias corridos.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-cm-6', name: 'Toast com Ovos Mexidos', category: 'Café da Manhã', prep: 8, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Torre o pão integral.\n2. Sirva os ovos mexidos cremosos por cima.', notes: 'Clássico nutritivo.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 100, unit: 'g', protein: 13 }]
  },
  {
    id: 'rec-cm-7', name: 'Iogurte com Castanhas', category: 'Café da Manhã', prep: 3, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Coloque o iogurte grego e pique as castanhas por cima.', notes: 'Preparo rápido.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 150, unit: 'g', protein: 15 }, { food_name: 'Castanha-do-Pará', quantity: 15, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-cm-8', name: 'Pão de Queijo de Frigideira', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture 1 ovo, tapioca e queijo minas ralado.\n2. Doure na frigideira.', notes: 'Versão leve.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Queijo Minas Frescal', quantity: 30, unit: 'g', protein: 4.2 }]
  },
  {
    id: 'rec-cm-9', name: 'Smoothie Verde Proteico', category: 'Café da Manhã', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata espinafre, maçã, água e whey protein.', notes: 'Detox e anabólico.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-cm-10', name: 'Bowl de Tofu Mexido', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Esfarele o tofu e refogue com cúrcuma e pimenta preta.', notes: 'Opção 100% vegetal.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 150, unit: 'g', protein: 22.5 }]
  },

  // ================= ALMOÇO (10) =================
  {
    id: 'rec-alm-1', name: 'Frango Grelhado com Arroz Integral', category: 'Almoço', prep: 20, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Grelhe o peito de frango.\n2. Sirva com arroz integral e salada.', notes: 'O clássico dos clássicos.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }, { food_name: 'Arroz Branco / Integral', quantity: 100, unit: 'g', protein: 2.6 }]
  },
  {
    id: 'rec-alm-2', name: 'Tilápia Assada com Legumes', category: 'Almoço', prep: 25, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Tempere a tilápia.\n2. Asse junto com legumes no forno.', notes: 'Baixa caloria.',
    ingredients: [{ food_name: 'Filé de Tilápia', quantity: 200, unit: 'g', protein: 52 }]
  },
  {
    id: 'rec-alm-3', name: 'Patinho com Feijão e Arroz', category: 'Almoço', prep: 20, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Refogue o patinho moído.\n2. Sirva com a dupla arroz e feijão.', notes: 'Rico em ferro.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 120, unit: 'g', protein: 38.4 }, { food_name: 'Arroz Branco / Integral', quantity: 100, unit: 'g', protein: 2.6 }, { food_name: 'Feijão Carioca Cozido', quantity: 100, unit: 'g', protein: 5 }]
  },
  {
    id: 'rec-alm-4', name: 'Salmão com Crosta de Castanhas', category: 'Almoço', prep: 20, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Empane o salmão em castanhas trituradas.\n2. Asse.', notes: 'Gorduras excelentes.',
    ingredients: [{ food_name: 'Salmão Grelhado', quantity: 150, unit: 'g', protein: 37.5 }, { food_name: 'Castanha-do-Pará', quantity: 15, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-alm-5', name: 'Escondidinho Fit de Frango', category: 'Almoço', prep: 30, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Faça um purê de abóbora ou batata doce.\n2. Recheie com frango desfiado.', notes: 'Muito saboroso.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 200, unit: 'g', protein: 62 }]
  },
  {
    id: 'rec-alm-6', name: 'Macarrão de Abobrinha com Patinho', category: 'Almoço', prep: 15, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Rale a abobrinha em fios.\n2. Cubra com molho de patinho moído.', notes: 'Low carb.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 150, unit: 'g', protein: 48 }]
  },
  {
    id: 'rec-alm-7', name: 'Strogonoff Fit de Frango', category: 'Almoço', prep: 20, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Use iogurte grego ou creme de ricota em vez de creme de leite.', notes: 'Clássico reinventado.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 200, unit: 'g', protein: 62 }, { food_name: 'Creme de Ricota Light', quantity: 50, unit: 'g', protein: 4.5 }]
  },
  {
    id: 'rec-alm-8', name: 'Bowl de Grão de Bico e Atum', category: 'Almoço', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture atum com grão de bico cozido e salada.', notes: 'Almoço em 5 minutos.',
    ingredients: [{ food_name: 'Atum Sólido ao Natural', quantity: 120, unit: 'g', protein: 31.2 }, { food_name: 'Grão de Bico Cozido', quantity: 100, unit: 'g', protein: 8.5 }]
  },
  {
    id: 'rec-alm-9', name: 'Tofu Grelhado com Lentilha', category: 'Almoço', prep: 20, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Grelhe fatias espessas de Tofu.\n2. Sirva com lentilha temperada.', notes: 'Vegano e forte.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 150, unit: 'g', protein: 22.5 }, { food_name: 'Lentilha Cozida', quantity: 100, unit: 'g', protein: 9 }]
  },
  {
    id: 'rec-alm-10', name: 'Salada Completa de Frango', category: 'Almoço', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Desfie frango grelhado sobre uma salada bem colorida com azeite.', notes: 'Super leve e crocante.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }]
  },

  // ================= LANCHE DA TARDE (10) =================
  {
    id: 'rec-lt-1', name: 'Iogurte com Aveia', category: 'Lanche da Tarde', prep: 3, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture iogurte e aveia.', notes: 'Prático para o trabalho.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 150, unit: 'g', protein: 15 }, { food_name: 'Aveia em Flocos', quantity: 20, unit: 'g', protein: 2.8 }]
  },
  {
    id: 'rec-lt-2', name: 'Bolinha de Queijo Fit', category: 'Lanche da Tarde', prep: 15, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Amasse batata doce, recheie com queijo cottage e asse.', notes: 'Lanche salgado.',
    ingredients: [{ food_name: 'Queijo Cottage Light', quantity: 50, unit: 'g', protein: 6 }]
  },
  {
    id: 'rec-lt-3', name: 'Shake de Whey com Banana', category: 'Lanche da Tarde', prep: 3, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata água ou leite com whey e 1 banana.', notes: 'Para pré-treino.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-lt-4', name: 'Mix de Castanhas e Queijo', category: 'Lanche da Tarde', prep: 2, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Porção de castanhas com cubos de queijo minas.', notes: 'Gorduras e proteínas rápidas.',
    ingredients: [{ food_name: 'Castanha-do-Pará', quantity: 20, unit: 'g', protein: 3.6 }, { food_name: 'Queijo Minas Frescal', quantity: 30, unit: 'g', protein: 4.2 }]
  },
  {
    id: 'rec-lt-5', name: 'Wrap de Frango Desfiado', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Use pão folha integral, frango e creme de ricota.', notes: 'Sacia muito.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 60, unit: 'g', protein: 18.6 }, { food_name: 'Creme de Ricota Light', quantity: 20, unit: 'g', protein: 1.8 }]
  },
  {
    id: 'rec-lt-6', name: 'Bolinho de Caneca Fit', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture 1 ovo, cacau, aveia e whey.\n2. Microondas por 2 mins.', notes: 'Tira a vontade de doce.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Whey Protein Concentrado', quantity: 15, unit: 'g', protein: 12 }]
  },
  {
    id: 'rec-lt-7', name: 'Atum com Torradinhas', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Patê de atum com creme de ricota.', notes: 'Snack salgado perfeito.',
    ingredients: [{ food_name: 'Atum Sólido ao Natural', quantity: 60, unit: 'g', protein: 15.6 }, { food_name: 'Creme de Ricota Light', quantity: 30, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-lt-8', name: 'Ovos de Codorna', category: 'Lanche da Tarde', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Cozinhe os ovos, tempere com sal e azeite.', notes: 'Ótimo snack.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 100, unit: 'g', protein: 13 }]
  },
  {
    id: 'rec-lt-9', name: 'Biscoito de Arroz com Cottage', category: 'Lanche da Tarde', prep: 2, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Passe o cottage nos biscoitos de arroz.', notes: 'Crocante.',
    ingredients: [{ food_name: 'Queijo Cottage Light', quantity: 50, unit: 'g', protein: 6 }]
  },
  {
    id: 'rec-lt-10', name: 'Smoothie Proteico de Morango', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata morangos congelados com whey de baunilha.', notes: 'Parece milk-shake.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },

  // ================= JANTAR (10) =================
  {
    id: 'rec-jan-1', name: 'Sopa Proteica de Frango', category: 'Jantar', prep: 25, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Cozinhe legumes e bata no liquidificador.\n2. Adicione frango desfiado.', notes: 'Perfeito pro frio.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }]
  },
  {
    id: 'rec-jan-2', name: 'Omelete de Forno Assado', category: 'Jantar', prep: 25, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata os ovos, adicione legumes e queijo.\n2. Asse por 20 min.', notes: 'Fica super alto.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 200, unit: 'g', protein: 26 }, { food_name: 'Queijo Minas Frescal', quantity: 50, unit: 'g', protein: 7 }]
  },
  {
    id: 'rec-jan-3', name: 'Salada Refrescante de Salmão', category: 'Jantar', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Salmão em lascas com salada bem verde.', notes: 'Bem leve.',
    ingredients: [{ food_name: 'Salmão Grelhado', quantity: 120, unit: 'g', protein: 30 }]
  },
  {
    id: 'rec-jan-4', name: 'Hambúrguer de Patinho', category: 'Jantar', prep: 15, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Molde o patinho moído em disco e grelhe.\n2. Sirva com salada sem pão.', notes: 'Jantar sem carbo.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 150, unit: 'g', protein: 48 }]
  },
  {
    id: 'rec-jan-5', name: 'Pizza com Massa de Frango', category: 'Jantar', prep: 30, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Triture o frango cozido com ovo para fazer a massa.\n2. Asse e ponha queijo.', notes: 'Massa proteica!',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 200, unit: 'g', protein: 62 }, { food_name: 'Queijo Minas Frescal', quantity: 50, unit: 'g', protein: 7 }]
  },
  {
    id: 'rec-jan-6', name: 'Espetinho de Tilápia', category: 'Jantar', prep: 20, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Cubos de tilápia grelhados no palito com tomate cereja.', notes: 'Divertido e saudável.',
    ingredients: [{ food_name: 'Filé de Tilápia', quantity: 150, unit: 'g', protein: 39 }]
  },
  {
    id: 'rec-jan-7', name: 'Tofu Empanado na Aveia', category: 'Jantar', prep: 20, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Passe o tofu no ovo (ou água temperada) e na aveia. Asse.', notes: 'Crocante.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 150, unit: 'g', protein: 22.5 }, { food_name: 'Aveia em Flocos', quantity: 20, unit: 'g', protein: 2.8 }]
  },
  {
    id: 'rec-jan-8', name: 'Salada de Atum e Grão de Bico', category: 'Jantar', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture tudo. Tempere com limão.', notes: 'Rápido.',
    ingredients: [{ food_name: 'Atum Sólido ao Natural', quantity: 120, unit: 'g', protein: 31.2 }, { food_name: 'Grão de Bico Cozido', quantity: 80, unit: 'g', protein: 6.8 }]
  },
  {
    id: 'rec-jan-9', name: 'Charuto de Couve com Patinho', category: 'Jantar', prep: 25, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Refogue o patinho.\n2. Enrole nas folhas de couve e cozinhe no molho de tomate.', notes: 'Low carb delicioso.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 200, unit: 'g', protein: 64 }]
  },
  {
    id: 'rec-jan-10', name: 'Berinjela Recheada com Frango', category: 'Jantar', prep: 30, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Corte a berinjela ao meio, retire o miolo.\n2. Misture com frango e asse.', notes: 'Rico em fibras.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }]
  },

  // ================= SOBREMESA (10) =================
  {
    id: 'rec-sob-1', name: 'Mousse Proteico de Chocolate', category: 'Sobremesa', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture iogurte grego com whey sabor chocolate. Gela.', notes: 'Super cremoso.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 100, unit: 'g', protein: 10 }, { food_name: 'Whey Protein Concentrado', quantity: 20, unit: 'g', protein: 16 }]
  },
  {
    id: 'rec-sob-2', name: 'Crepe Doce de Aveia', category: 'Sobremesa', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Massa fininha de aveia com claras.\n2. Recheie com morangos e um pouco de whey concentrado em pasta.', notes: 'Parece de restaurante.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Whey Protein Concentrado', quantity: 15, unit: 'g', protein: 12 }]
  },
  {
    id: 'rec-sob-3', name: 'Picolé de Iogurte e Frutas', category: 'Sobremesa', prep: 10, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata iogurte com frutas e congele em forminhas.', notes: 'Perfeito pro verão.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 200, unit: 'g', protein: 20 }]
  },
  {
    id: 'rec-sob-4', name: 'Cheesecake de Copinho Fit', category: 'Sobremesa', prep: 15, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Fundo de castanhas trituradas.\n2. Creme de ricota com adoçante.\n3. Geleia diet por cima.', notes: 'Elegante.',
    ingredients: [{ food_name: 'Creme de Ricota Light', quantity: 80, unit: 'g', protein: 7.2 }, { food_name: 'Castanha-do-Pará', quantity: 15, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-sob-5', name: 'Sorvete de Banana com Whey', category: 'Sobremesa', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Processe banana congelada com 1 scoop de whey.', notes: 'Fica igual sorvete.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-sob-6', name: 'Beijinho Proteico', category: 'Sobremesa', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture leite em pó desnatado, whey de coco e um pouco de água até dar ponto.', notes: 'Docinho prático.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-sob-7', name: 'Pudim de Chia com Iogurte', category: 'Sobremesa', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Misture chia no iogurte e deixe na geladeira da noite pro dia.', notes: 'Super nutritivo.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 150, unit: 'g', protein: 15 }]
  },
  {
    id: 'rec-sob-8', name: 'Brownie de Caneca de Aveia', category: 'Sobremesa', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    instructions: '1. 1 ovo, cacau, adoçante e 1 col de aveia.\n2. Microondas 1 minuto.', notes: 'Rapidin.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Aveia em Flocos', quantity: 15, unit: 'g', protein: 2.1 }]
  },
  {
    id: 'rec-sob-9', name: 'Torta de Maçã na Frigideira', category: 'Sobremesa', prep: 15, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Fatie maçãs, doure.\n2. Jogue a mistura de panqueca de aveia por cima e tampe.', notes: 'Cheiro maravilhoso.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Aveia em Flocos', quantity: 20, unit: 'g', protein: 2.8 }]
  },
  {
    id: 'rec-sob-10', name: 'Copinho de Tofu de Chocolate', category: 'Sobremesa', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    instructions: '1. Bata tofu macio com cacau em pó e adoçante no processador. Gela.', notes: 'Proteína limpa.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 100, unit: 'g', protein: 15 }]
  }
];
